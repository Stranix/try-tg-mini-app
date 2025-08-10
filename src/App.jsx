import { createSignal } from "solid-js";
import styles from "./app.module.css";

export default function App() {
  const [arrival, setArrival] = createSignal("");
  const [departure, setDeparture] = createSignal("");
  const [report, setReport] = createSignal("");

  // Получаем объект Telegram WebApp
  const tg = window.Telegram?.WebApp;

  const handleSubmit = () => {
    const data = {
      arrival: arrival(),
      departure: departure(),
      report: report(),
    };

    // Передаём данные обратно в бота
    if (tg) {
      tg.sendData(JSON.stringify(data));
    } else {
      alert("Данные: " + JSON.stringify(data));
    }
  };

    return (
    <div class={styles["form-container"]}>
      <h1 class={styles["title"]}>Акт выполненных работ</h1>

      <label>Дата и время прибытия</label>
      <input
        type="datetime-local"
        value={arrival()}
        onInput={(e) => setArrival(e.target.value)}
      />

      <label>Дата и время убытия</label>
      <input
        type="datetime-local"
        value={departure()}
        onInput={(e) => setDeparture(e.target.value)}
      />

      <label>Отчёт о решении</label>
      <textarea
        placeholder="Опишите, что было сделано..."
        value={report()}
        onInput={(e) => setReport(e.target.value)}
      />

      <button class={styles["submit-btn"]} onClick={handleSubmit}>
        Отправить
      </button>
    </div>
  );
}
