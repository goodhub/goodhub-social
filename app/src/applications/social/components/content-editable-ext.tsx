import React, { FC, useEffect, useRef, useState } from 'react';
// import sanitizeHtml from 'sanitize-html';

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
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const [prevCursorPosition, setPrevCursorPosition] = useState<number | null>(null);

  useEffect(() => {
    try{
      if (textRef.current && prevCursorPosition !== null) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.setStart(textRef.current?.childNodes[0] || textRef.current, prevCursorPosition || 0);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
        setPrevCursorPosition(null); // Reset prevCursorPosition after restoring cursor position
      }
    }catch(error: any){
      console.log(error.message)
    }
    }, [prevCursorPosition]);


  //supress inputs < > and ctrl/cmd b or i
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if ((e.key === '<' || e.key === '>')||((e.metaKey || e.ctrlKey) && (e.key === 'b' || e.key === 'i'))) {
      e.preventDefault(); // Prevent the default action for the keystroke
    }
  };

  const handleInputChange = (): void => {
  
    //const newValue = sanitizeHtml(textRef.current?.textContent as string, {allowedTags: [],allowedAttributes: {}}) || '';
    const newValue = textRef.current?.textContent as string || '';
    const parser = new DOMParser();
    const doc = parser.parseFromString(newValue, 'text/html');
    const textContent = doc.body.textContent || ''; // Extract text content from parsed HTML
    const sanitizedValue = textContent.replace(/<[^>]*>/g, ''); // Remove HTML tags
    // console.log("cleanValue - " + sanitizedValue);

    // if (textRef.current) {
    //   //unstyle any edits by shortcuts this will need refactoring;
    //   // Apply styles to <b> elements
    //   Array.from(textRef.current.getElementsByTagName('b')).forEach(bElement => {
    //     bElement.style.fontWeight = 'normal';
    //   });
    //   // Apply styles to <i> elements
    //   Array.from(textRef.current.getElementsByTagName('i')).forEach(iElement => {
    //     iElement.style.fontStyle = 'normal';
    //   });
    //   // Hide <img> elements
    //   Array.from(textRef.current.getElementsByTagName('img')).forEach(imgElement => {
    //     imgElement.style.display = 'none';
    //   });
    //   // Call your storeSetter or handleInputChange function here
    // }

    const selection = window.getSelection();
    if (selection) {
      setPrevCursorPosition(selection.focusOffset); // Preserve cursor position
    }
    setValue(sanitizedValue);
    storeSetter(sanitizedValue);
  };

  return (
    <div
      ref={textRef}
      className={className}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onInput={handleInputChange}
      onKeyDown={handleKeyDown}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};

export default EditableText;
