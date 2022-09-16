import React from 'react'
import { FaAsterisk } from "react-icons/fa";

// Define interface for component props/api:
export interface DropZoneProps {
  required: boolean;
  caption?: string;
  name: string;
  label: string;
  onDragStateChange?: (isDragActive: boolean) => void;
  onDrag?: () => void;
  onDragIn?: () => void;
  onDragOut?: () => void;
  onDrop?: () => void;
  onFilesDrop?: (files: File[]) => void;
}

export const DropZone = React.memo((props: React.PropsWithChildren<DropZoneProps>) => {
  const {
    required,
    caption,
    name,
    label,
    onDragStateChange,
    onFilesDrop,
    onDrag,
    onDragIn,
    onDragOut,
    onDrop,
  } = props

  // Create state to keep track when dropzone is active/non-active:
  const [isDragActive, setIsDragActive] = React.useState(false)
  // Prepare ref for dropzone element:
  const dropZoneRef = React.useRef<null | HTMLDivElement>(null)

  // Create helper method to map file list to array of files:
  const mapFileListToArray = (files: FileList) => {
    const array = []

    for (let i = 0; i < files.length; i++) {
      array.push(files.item(i))
    }

    return array
  }

  // Create handler for dragenter event:
  const handleDragIn = React.useCallback(
    (event: any) => {
      event.preventDefault()
      event.stopPropagation()
      onDragIn?.()

      if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
        setIsDragActive(true)
      }
    },
    [onDragIn]
  )

  // Create handler for dragleave event:
  const handleDragOut = React.useCallback(
    (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
      onDragOut?.()

      setIsDragActive(false)
    },
    [onDragOut]
  )

  // Create handler for dragover event:
  const handleDrag = React.useCallback(
    (event: Event) => {
      event.preventDefault()
      event.stopPropagation()

      onDrag?.()
      if (!isDragActive) {
        setIsDragActive(true)
      }
    },
    [isDragActive, onDrag]
  )

  // Create handler for drop event:
  const handleDrop = React.useCallback(
    (event: any) => {
      event.preventDefault()
      event.stopPropagation()

      setIsDragActive(false)
      onDrop?.()

      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        const files = mapFileListToArray(event.dataTransfer.files) as File[]

        onFilesDrop?.(files)
        event.dataTransfer.clearData()
      }
    },
    [onDrop, onFilesDrop]
  )

  // Obser active state and emit changes:
  React.useEffect(() => {
    onDragStateChange?.(isDragActive)
  }, [isDragActive, onDragStateChange])

  // Attach listeners to dropzone on mount:
  React.useEffect(() => {
    const tempZoneRef = dropZoneRef?.current
    if (tempZoneRef) {
      tempZoneRef.addEventListener('dragenter', handleDragIn)
      tempZoneRef.addEventListener('dragleave', handleDragOut)
      tempZoneRef.addEventListener('dragover', handleDrag)
      tempZoneRef.addEventListener('drop', handleDrop)
    }

   return () => {
      tempZoneRef?.removeEventListener('dragenter', handleDragIn)
      tempZoneRef?.removeEventListener('dragleave', handleDragOut)
      tempZoneRef?.removeEventListener('dragover', handleDrag)
      tempZoneRef?.removeEventListener('drop', handleDrop)
    }
  }, [handleDrag, handleDragIn, handleDragOut, handleDrop])

  return (
    <div className="flex flex-col my-6">
    <div className="flex items-center my-1">
      <label className="text-xl" htmlFor={name}>{label}</label>
      {required ? <FaAsterisk className="fill-red-500 ml-2" size={10}/> : null}
    </div>
    {caption && <label className="mb-3 text-gray-400 text-sm">{caption}</label>}
    <div ref={dropZoneRef} className="w-auto flex">
      {props.children}
    </div>
  </div>

  )
})

DropZone.displayName = 'DropZone'
