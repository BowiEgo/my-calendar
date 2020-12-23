export default (props) => {

  const wl = props.week.map((date, idx) => {
    return <th key={idx}>{date.week()}</th>;
  });

  return (
    <div className="calendar-grid">
      <div className="calendar-grid-week">
        <div className="timezone">GMT-05</div>
        <div className="week">
        {wl}
        </div>
      </div>
      <div className="calendar-grid-content">
        <div className="calendar-grid-label">
        <div className="calendar-grid-table">
      </div>
    </div>
  )
}