import "./Page.css";
import { Show, createState, createSignal, onMount } from "solid-js";

type PageProps = {
  id: string;
};

export default function Page(props: PageProps) {

  return (
    <div className="App">
      <header className="App-header">

        <p>
          Edit <code>src/App.tsx</code> and eload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
