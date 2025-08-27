import "./App.css";
import MacWindow from "./ui/MacWindow";
import MacTitleBar from "./ui/TitleBar";

export default function App() {
  return (
    <div className="relative h-screen w-screen bg-neutral-100">
      <MacWindow initialRect={{ x: 60, y: 60, w: 680, h: 420 }}>
        <MacTitleBar title="Notes.txt" />
        <div className="p-4 h-[calc(100%-2.5rem)] overflow-auto">
          Window A content…
        </div>
      </MacWindow>

      <MacWindow initialRect={{ x: 220, y: 140, w: 760, h: 520 }} inset={12}>
        <MacTitleBar title="Inspector" />
        <div className="p-4 h-[calc(100%-2.5rem)] overflow-auto">
          Window B content…
        </div>
      </MacWindow>
    </div>
  );
}
