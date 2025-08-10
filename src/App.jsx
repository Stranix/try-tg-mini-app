import { createSignal } from "solid-js";
import styles from "./app.module.css";

export default function App() {
  const [arrival, setArrival] = createSignal("");
  const [departure, setDeparture] = createSignal("");
  const [report, setReport] = createSignal("");

  // Получаем объект Telegram WebApp
  const tg = window.Telegram?.WebApp;
  const urlParams = new URLSearchParams(window.location.search);
  const ticketId = urlParams.get("ticket_id");

  const handleSubmit = () => {
  if (!arrival() || !departure() || !report()) {
    alert("Заполните все поля!");
    return;
  }

  if (new Date(arrival()) > new Date(departure())) {
    alert("Дата прибытия не может быть позже даты убытия!");
    return;
  }

  if (tg?.initDataUnsafe?.query_id) {
    const payload = {
      query_id: tg.initDataUnsafe.query_id,
      arrival: arrival(),
      departure: departure(),
      report: report(),
    };

    fetch(`http://95.164.18.122/webapp/answer/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка отправки данных");
        return res.json();
      })
      .then(() => {
        alert("Данные приняты. Ожидайте акт");
        tg.close();
      })
      .catch((err) => {
        console.error(err);
        alert("Не удалось отправить данные. Попробуйте ещё раз.");
      });
  }
};

    return (
    <div class={styles["form-container"]}>
      <h1 class={styles["title"]}>Акт выполненных работ #{ticketId}</h1>

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
        placeholder="Опишите, что было сделано.."
        value={report()}
        onInput={(e) => setReport(e.target.value)}
      />

      <button class={styles["submit-btn"]} onClick={handleSubmit}>
        Отправить
      </button>
    </div>
  );
}
