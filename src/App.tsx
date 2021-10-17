import QRCode from 'qrcode-svg';
import React from 'react';
import  {
  useCallback,
  useReducer,
  useState,
} from 'react';
import './App.css';

const emptyLabels = new Array<{
  uri: string,
  text: string,
}>();

function App() {
  const [text, onTextChanged] = useReducer((_text: string, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    return e.target.value;
  }, '');
  const [labels, setLabels] = useState(emptyLabels);
  const onFormSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    setLabels(text.split(/\r?\n/g).map(line => {
      return /([^ ]+) ?(.*)/.exec(line);
    }).filter(x => x).map(lineParts => {
      if (lineParts === null) throw new Error('TypeScript does not know this is unreachable');
      return {
        uri: lineParts[1],
        text: lineParts[2],
      };
    }));
    return e.preventDefault();
  }, [
    text,
  ]);
  const innerEntryMargin = '8pt';
  return (
    <div className="App">
      <header className="App-header noprint">
        <p>
          Each line is a URI followed by a space followed by label text. The label is shown to the right of the QR code.
        </p>
        <form onSubmit={onFormSubmit}>
          <textarea onChange={onTextChanged} value={text}/>
          <button>Go</button>
        </form>
    </header>
    <ul style={{
      listStyle: 'none',
      margin: 0,
      padding: 0,
    }}>
    {labels.map((label, i) => <li key={i} style={{
      display: 'flex',
      margin: '20pt',
      marginBottom: 0,
    }}>
      <img alt={label.uri} src={'data:image/svg+xml;base64,' + Buffer.from(new QRCode({
          content: label.uri,
          ecl: 'H',
          // Use padding from outside instead to enable alignment with text.
          padding: 0,
      }).svg()).toString('base64')} style={{
        flexGrow: 0,
        margin: innerEntryMargin,
        marginRight: 0,
        width: '1.5cm',
      }} />
      <div style={{
        margin: innerEntryMargin
      }}>
        {label.text}
      </div>
    </li>)}
        </ul>
    </div>
  );
}

export default App;
