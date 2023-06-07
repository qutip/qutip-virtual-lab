const banner =
  "\n\
  ______ __  __  _____  _____ _____  _____ _____ _______ ______ _   _     \n\
 |  ____|  \\/  |/ ____|/ ____|  __ \\|_   _|  __ \\__   __|  ____| \\ | |\n\
 | |__  | \\  / | (___ | |    | |__) | | | | |__) | | |  | |__  |  \\| |  \n\
 |  __| | |\\/| |\\___ \\| |    |  _  /  | | |  ___/  | |  |  __| | . ` | \n\
 | |____| |  | |____) | |____| | \\ \\ _| |_| |      | |  | |____| |\\  | \n\
 |______|_|  |_|_____/_\\_____|_|_ \\_\\_____|_|___   |_|  |______|_| \\_|\n\
              |  ____/ __ \\|  __ \\ / ____|  ____|                       \n\
              | |__ | |  | | |__) | |  __| |__                            \n\
              |  __|| |  | |  _  /| | |_ |  __|                           \n\
              | |   | |__| | | \\ \\| |__| | |____                        \n\
              |_|    \\____/|_|  \\_\\\\_____|______|                     \n\
";
console.log("This page is powered by:\n", banner);

outputtext = document.myform.outputtext;
outputtext.value = "";

default_txt =
  "\
import pyjs\n\
import numpy\n\
\n\
arr = numpy.random.rand(4,5)\n\
print(arr)\n\
";

const editor = CodeMirror.fromTextArea(document.myform.inputtext, {
  lineNumbers: true,
  mode: "python",
  theme: "monokai",
  extraKeys: {
    Tab: function (cm) {
      cm.replaceSelection("   ", "end");
    },
  },
});
editor.setSize(null, 600);

const logeditor = CodeMirror.fromTextArea(document.myform.outputtext, {
  lineNumbers: false,
  readOnly: true,
  //  add theme attribute like so:
  theme: "monokai",
});
logeditor.setSize(null, 200);

function addToOutput(txt) {
  logeditor.replaceRange(txt + "\n", CodeMirror.Pos(logeditor.lastLine()));
  logeditor.scrollTo(CodeMirror.Pos(logeditor.lastLine()));
  const info = logeditor.getScrollInfo();
  logeditor.scrollTo(info.left, info.top + info.height);
}

const print = (text) => {
  addToOutput(text);
};
const printErr = (text) => {
  // these can be ignored
  if (
    !text.startWith("Could not find platform dependent libraries") &&
    !text.startWith("Consider setting $PYTHONHOME")
  ) {
    addToOutput("ERROR: " + text);
  }
};

window.onload = () => {
  const savedText = localStorage.getItem("text") || default_txt;
  editor.getDoc().setValue(savedText);
};

async function make_pyjs(print, error) {
  const pyjs = await createModule({ print: print, error: print });

  await pyjs.bootstrap_from_empack_packed_environment(
    `./empack_env_meta.json` /* packages_json_url */,
    "." /* package_tarballs_root_url */,
    false /* verbose */
  );

  return pyjs;
}

const Module = {};
(async function () {
  addToOutput("Download data ...");
  const pyjs = await make_pyjs(print, print);
  await pyjs.init();

  addToOutput("...done");
  main_scope = pyjs.main_scope();

  const btn = document.getElementById("run_button");
  btn.disabled = false;

  btn.onclick = function () {
    logeditor.getDoc().setValue("");
    const text = editor.getValue();
    localStorage.setItem("text", text);

    try {
      pyjs.exec(text, main_scope);
    } catch (e) {
      logeditor.replaceRange(
        JSON.stringify(e.message) + "\n",
        CodeMirror.Pos(logeditor.lastLine())
      );
    }
  };
})();
