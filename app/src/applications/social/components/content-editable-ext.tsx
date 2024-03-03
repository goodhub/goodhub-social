import React, { FC, useEffect, useRef, useState } from 'react';
import sanitizeHtml from 'sanitize-html';

interface EditableTextProps {
  initialValue: string;
  className: string;
  storeSetter: (newValue: string) => void;
}

const EditableText: FC<EditableTextProps> = ({
  initialValue,
  className,
  storeSetter,
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [prevCursorPosition, setPrevCursorPosition] = useState<number | null>(null);

  useEffect(() => {
    if (textRef.current && prevCursorPosition !== null) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.setStart(textRef.current?.childNodes[0] || textRef.current, prevCursorPosition || 0);
      range.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(range);
      setPrevCursorPosition(null); // Reset prevCursorPosition after restoring cursor position
    }
  }, [prevCursorPosition]);

  const handleInputChange = (): void => {
    const newValue = sanitizeHtml(textRef.current?.textContent as string, {allowedTags: [],allowedAttributes: {}}) || '';
    //const newValue = textRef.current?.textContent as string || '';

    if (textRef.current) {
      //unstyle any edits by shortcuts this will need refactoring;
      // Apply styles to <b> elements
      Array.from(textRef.current.getElementsByTagName('b')).forEach(bElement => {
        bElement.style.fontWeight = 'normal';
      });
      // Apply styles to <i> elements
      Array.from(textRef.current.getElementsByTagName('i')).forEach(iElement => {
        iElement.style.fontStyle = 'normal';
      });
      // Hide <img> elements
      Array.from(textRef.current.getElementsByTagName('img')).forEach(imgElement => {
        imgElement.style.display = 'none';
      });
      // Call your storeSetter or handleInputChange function here
    }

    const selection = window.getSelection();
    if (selection) {
      setPrevCursorPosition(selection.focusOffset); // Preserve cursor position
    }
    storeSetter(newValue);
  };

  return (
    <div
      ref={textRef}
      className={className}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onInput={handleInputChange}
      dangerouslySetInnerHTML={{ __html: initialValue }}
    />
  );
};

export default EditableText;
