'use client';

import { useEffect, useRef } from 'react';
import { inject, Workspace, WorkspaceSvg } from 'blockly';
import darkTheme from '@blockly/theme-dark';
import { futbolToolbox } from '@/lib/toolbox/futbol-toolbox';
import { defineFutbolBlocks, registerFutbolGenerators } from '@/lib/blocks/futbol-blocks';

interface FutbolEditorProps {
  onWorkspaceChange?: (workspace: Workspace) => void;
}

export default function FutbolEditor({ onWorkspaceChange }: FutbolEditorProps) {
  const futbolDiv = useRef<HTMLDivElement>(null);
  const workspace = useRef<WorkspaceSvg | null>(null);

  useEffect(() => {
    if (futbolDiv.current && !workspace.current) {
      defineFutbolBlocks();
      registerFutbolGenerators();

      workspace.current = inject(futbolDiv.current, {
        theme: darkTheme,
        toolbox: futbolToolbox,
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        },
        trashcan: true,
        maxBlocks: 12
      });

      if (onWorkspaceChange) {
        workspace.current.addChangeListener(() => {
          onWorkspaceChange(workspace.current!);
        });
      }
    }

    return () => {
      if (workspace.current) {
        workspace.current.dispose();
        workspace.current = null;
      }
    };
  }, [onWorkspaceChange]);

  return (
    <div className="h-full w-full">
      <div
        ref={futbolDiv}
        className="h-full w-full min-h-[500px]"
        style={{ height: '600px' }}
      />
    </div>
  );
}