const weeks = ['日', '月', '火', '水', '木', '金', '土']
const date = new Date()
const today = new Date()
let year = date.getFullYear()
let month = date.getMonth() + 1
let day = today.getDate();
let events = {};
const config = {
    show: 3,
}

function showCalendar(year, month) {
    for (let i = 0; i < config.show; i++) {
        const calendarHtml = createCalendar(year, month)
        const sec = document.createElement('section')
        sec.innerHTML = calendarHtml
        document.querySelector('#calendar').appendChild(sec)

        month++
        if (month > 12) {
            year++
            month = 1
        }
    }
}

document.addEventListener("click", function(e) {
    if (e.target.classList.contains("calendar_td")) {
        const clickedDate = new Date(e.target.dataset.date); // クリックした日付
        const today = new Date(); // 今日の日付

        // 日付の差を計算
        const timeDiff = clickedDate - today;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24) + 1);
        
        // イベントモーダルを開く
        document.getElementById('eventModal').style.display = "block";
        document.getElementById('saveEvent').dataset.date = e.target.dataset.date;
        
        // 結果をアラートで表示
        if (daysDiff == 0) {
            alert(`今日は${month}月${day}日です`);
        } else if (daysDiff > 0) {
            const click_month = clickedDate.getMonth() + 1;
            const click_day = clickedDate.getDate();
            alert(`${click_month}月${click_day}は、今日から${daysDiff}日後です`);
        } else {
            const timeDiff = today - clickedDate;
            const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const click_month = clickedDate.getMonth() + 1;
            const click_day = clickedDate.getDate();
            alert(`${click_month}月${click_day}から${daysDiff}日たちました`);
        }
    } else if (e.target.classList.contains("event-marker")) {
        const eventDate = e.target.dataset.date;
        const eventList = events[eventDate] || [];
        document.getElementById('eventList').innerHTML = eventList.map(event => `<div>${event.title}</div>`).join('');
        document.getElementById('viewEventsModal').style.display = "block";
    }
});

document.getElementById('saveEvent').addEventListener('click', function() {
    const eventTitle = document.getElementById('eventTitle').value;
    const eventDate = this.dataset.date;

    if (!events[eventDate]) {
        events[eventDate] = [];
    }

    events[eventDate].push({ title: eventTitle });
    document.getElementById('eventModal').style.display = "none";
    document.getElementById('eventTitle').value = '';

    // カレンダーを再描画してイベントを表示
    document.querySelector('#calendar').innerHTML = '';
    showCalendar(year, month);
});

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        document.getElementById('eventModal').style.display = "none";
        document.getElementById('viewEventsModal').style.display = "none";
    });
});

function createCalendar(year, month) {
    const startDate = new Date(year, month - 1, 1); // 月の最初の日を取得
    const endDate = new Date(year, month, 0); // 月の最後の日を取得
    const endDayCount = endDate.getDate(); // 月の末日
    const lastMonthEndDate = new Date(year, month - 2, 0); // 前月の最後の日の情報
    const lastMonthendDayCount = lastMonthEndDate.getDate(); // 前月の末日
    const startDay = startDate.getDay(); // 月の最初の日の曜日を取得
    let dayCount = 1; // 日にちのカウント
    let calendarHtml = ''; // HTMLを組み立てる変数

    calendarHtml += '<h2>' + year + '/' + month + '</h2>';
    calendarHtml += '<table>';

    // 曜日の行を作成
    for (let i = 0; i < weeks.length; i++) {
        calendarHtml += '<td class="dayOfweek">' + weeks[i] + '</td>';
    }

    for (let w = 0; w < 6; w++) {
        calendarHtml += '<tr>';

        for (let d = 0; d < 7; d++) {
            if (w === 0 && d < startDay) {
                // 1行目で1日の曜日の前
                let num = lastMonthendDayCount - startDay + d + 1;
                calendarHtml += '<td class="is-disabled">' + num + '</td>';
            } else if (dayCount > endDayCount) {
                // 末尾の日数を超えた
                let num = dayCount - endDayCount;
                calendarHtml += '<td class="is-disabled">' + num + '</td>';
                dayCount++;
            } else {
                const eventDate = year + '/' + month + '/' + dayCount;
                let eventHtml = '';

                if (events[eventDate]) {
                    eventHtml = events[eventDate].map(event => `<div class="event-marker" data-date="${eventDate}">&#x25CF;</div>`).join('');
                }

                if (year === today.getFullYear() && month === (today.getMonth() + 1) && dayCount === today.getDate()) {
                    calendarHtml += `<td class='today calendar_td' data-date="${eventDate}">${dayCount}<br>${eventHtml}</td>`;
                } else {
                    calendarHtml += `<td class="calendar_td" data-date="${eventDate}">${dayCount}<br>${eventHtml}</td>`;
                }

                dayCount++;
            }
        }
        calendarHtml += '</tr>';
    }
    calendarHtml += '</table>';

    return calendarHtml;
}

function moveCalendar(e) {
    document.querySelector('#calendar').innerHTML = '';

    if (e.target.id === 'prev') {
        month--;

        if (month < 1) {
            year--;
            month = 12;
        }
    }

    if (e.target.id === 'next') {
        month++;

        if (month > 12) {
            year++;
            month = 1;
        }
    }

    showCalendar(year, month);
}

document.querySelector('#prev').addEventListener('click', moveCalendar);
document.querySelector('#next').addEventListener('click', moveCalendar);

document.addEventListener("DOMContentLoaded", function() {
    showCalendar(year, month);
});


