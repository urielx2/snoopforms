/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import DragDrop from "editorjs-drag-drop";
import Undo from "editorjs-undo";
import TextQuestion from "./tools/TextQuestion";
import SubmitButton from "./tools/SubmitButton";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";

const Editor = ({ id, autofocus = false, onChange, value }) => {
  const [blocks, setBlocks] = useState([]);
  const ejInstance = useRef<EditorJS | null>();

  useEffect(() => {
    if (ejInstance.current) {
      onChange(blocks);
    }
  }, [blocks]);

  // This will run only once
  useEffect(() => {
    if (!ejInstance.current) {
      initEditor();
    }
    return () => {
      destroyEditor();
    };
    async function destroyEditor() {
      await ejInstance.current.isReady;
      ejInstance.current.destroy();
      ejInstance.current = null;
    }
  }, []);

  const initEditor = () => {
    const editor = new EditorJS({
      minHeight: 0,
      holder: id,
      data: value,
      onReady: () => {
        ejInstance.current = editor;
        new DragDrop(editor);
        new Undo({ editor });
      },
      onChange: async () => {
        let content = await editor.saver.save();
        setBlocks(content.blocks);
      },
      autofocus: autofocus,
      tools: {
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
          config: {
            placeholder:
              "Start with your content or hit tab-key to insert block",
          },
        },
        header: {
          class: Header,
          config: {
            placeholder: "Enter a header",
            levels: [1, 2, 3],
            defaultLevel: 1,
          },
        },
        textQuestion: TextQuestion,
        submitButton: SubmitButton,
      },
    });
  };

  return (
    <Fragment>
      <div id={id} />
    </Fragment>
  );
};

export default Editor;
