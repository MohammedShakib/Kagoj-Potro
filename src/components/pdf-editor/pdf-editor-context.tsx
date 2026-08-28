"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react";
import { EditorObject, EditorState, ToolMode } from "@/types/pdf-editor";

interface PdfEditorContextType extends EditorState {
  setToolMode: (mode: ToolMode) => void;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  addObject: (obj: EditorObject) => void;
  updateObject: (id: string, updates: Partial<EditorObject>) => void;
  deleteObject: (id: string) => void;
  selectObject: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const PdfEditorContext = createContext<PdfEditorContextType | null>(null);

export function usePdfEditor() {
  const context = useContext(PdfEditorContext);
  if (!context) {
    throw new Error("usePdfEditor must be used within a PdfEditorProvider");
  }
  return context;
}

export function PdfEditorProvider({ children }: { children: ReactNode }) {
  const [objects, setObjects] = useState<EditorObject[]>([]);
  const [history, setHistory] = useState<EditorObject[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const [toolMode, setToolMode] = useState<ToolMode>("select");
  const [zoom, setZoom] = useState(1.0);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  const pushHistory = useCallback((newObjects: EditorObject[]) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newObjects);
      // Keep only last 20 states to prevent memory issues
      if (newHistory.length > 20) {
        newHistory.shift();
      }
      return newHistory;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 20));
  }, [historyIndex]);

  const addObject = useCallback((obj: EditorObject) => {
    setObjects((prev) => {
      const next = [...prev, obj];
      pushHistory(next);
      return next;
    });
    setSelectedObjectId(obj.id);
    setToolMode("select");
  }, [pushHistory]);

  const updateObject = useCallback((id: string, updates: Partial<EditorObject>) => {
    setObjects((prev) => {
      const next = prev.map((obj) => (obj.id === id ? { ...obj, ...updates } as EditorObject : obj));
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const deleteObject = useCallback((id: string) => {
    setObjects((prev) => {
      const next = prev.filter((obj) => obj.id !== id);
      pushHistory(next);
      return next;
    });
    if (selectedObjectId === id) {
      setSelectedObjectId(null);
    }
  }, [pushHistory, selectedObjectId]);

  const selectObject = useCallback((id: string | null) => {
    setSelectedObjectId(id);
    if (id) {
      setToolMode("select");
    }
  }, []);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setObjects(history[newIndex]);
      setSelectedObjectId(null);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setObjects(history[newIndex]);
      setSelectedObjectId(null);
    }
  }, [history, historyIndex]);

  const value = useMemo(() => ({
    objects,
    history,
    historyIndex,
    toolMode,
    zoom,
    selectedObjectId,
    setToolMode,
    setZoom,
    addObject,
    updateObject,
    deleteObject,
    selectObject,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  }), [
    objects, history, historyIndex, toolMode, zoom, selectedObjectId,
    setToolMode, setZoom, addObject, updateObject, deleteObject, selectObject, undo, redo
  ]);

  return (
    <PdfEditorContext.Provider value={value}>
      {children}
    </PdfEditorContext.Provider>
  );
}
