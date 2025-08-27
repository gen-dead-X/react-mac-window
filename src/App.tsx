import './App.scss';

import MacDesktop from './ui/MacDesktop';
import MacWindow from './ui/MacWindow';
import MacTitleBar from './ui/TitleBar';

export default function App() {
  return (
    <div className="bg-neutral-100">
      <MacDesktop>
        <MacWindow initialRect={{ x: 60, y: 60, w: 300, h: 420 }}>
          <MacTitleBar title="Notes.txt" />
          <div className="h-[calc(100%-2.5rem)] overflow-auto p-4">
            Window A content…
          </div>
        </MacWindow>

        <MacWindow initialRect={{ x: 220, y: 140, w: 400, h: 300 }}>
          <MacTitleBar title="Inspector" />
          <div className="h-[calc(100%-2.5rem)] overflow-auto p-4">
            Window B content…
          </div>
        </MacWindow>
      </MacDesktop>
    </div>
  );
}
