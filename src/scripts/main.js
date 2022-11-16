import {schema} from 'prosemirror-schema-basic';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Schema, DOMParser} from 'prosemirror-model';
import {undo, redo, history} from 'prosemirror-history';
import {addListNodes} from 'prosemirror-schema-list';
import {exampleSetup} from 'prosemirror-example-setup';
import {keymap} from 'prosemirror-keymap';
import {baseKeymap} from 'prosemirror-commands';

// doc level properties
const plugins = [
  history(),
  keymap({'Mod-z': undo, 'Mod-y': redo}),
  keymap(baseKeymap)
];
const editor = document.querySelector('#editor');

//documents
const docs = [
  // predefined from HTML
  DOMParser.fromSchema(schema).parse(document.getElementById('test')),
  // create on-the-fly
  schema.node('doc', null, [
    schema.node('paragraph', null, [schema.text('One.')]),
    schema.node('horizontal_rule'),
    schema.node('paragraph', null, [schema.text('Two!')])
  ])
];

//states
const states = [
  // from document
  EditorState.create({
    doc: docs[0],
    plugins: plugins
  }),
  // blank
  EditorState.create({
    schema,
    plugins: plugins
  })
];

//views... set constant here to determine which view to use
const viewNumber = 0;
let views = [];

// 0. user-defined
const myView = new EditorView(editor, {
  state: states[0],
  dispatchTransaction(tr) {
    // eslint-disable-next-line no-console
    console.log(tr.doc.resolve(tr.doc.content.size - 1));
    myView.updateState(myView.state.apply(tr));
  } 
});
views.push(myView);

// 1. example https://prosemirror.net/examples/basic/
const exampleSchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks
});
const exampleView = new EditorView(editor, {
  state: EditorState.create({
    doc: DOMParser.fromSchema(exampleSchema).parse(editor),
    plugins: exampleSetup({schema: exampleSchema})
  })
});
views.push(exampleView);

window.view = views[viewNumber];