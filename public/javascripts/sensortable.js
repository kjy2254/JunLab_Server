function initializePage() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const month2 = (month < 10 ? "0" + month : month);
    const day = today.getDate();

    const defaultDay = `${year}-${month2}-${day}`;

    document.querySelector('#start').value = defaultDay;
    document.querySelector('#end').value = defaultDay;

    const sp = new URLSearchParams(location.search);
    if (sp.get('start')) document.querySelector('#start').value = sp.get('start').replaceAll('/', '-');
    if (sp.get('end')) document.querySelector('#end').value = sp.get('end').replaceAll('/', '-');
    if (sp.get('id')) document.querySelector('#id').value = sp.get('id');

    if (!document.getElementById('results')) {
        document.getElementById('download').disabled = true;
    }
}

function search() {
    const idValue = document.getElementById('id').value;
    const startValue = document.getElementById('start').value.replaceAll('-', '/');
    const endValue = document.getElementById('end').value.replaceAll('-', '/');
    const page = 1; // 검색할 때는 첫 페이지로 이동

    const queryString = `?id=${idValue}&start=${startValue}&end=${endValue}&page=${page}`;
    location.href = `/iitp/table${queryString}`;
}

function downloadCSV() {
    const idValue = document.getElementById('id').value;
    const startValue = document.getElementById('start').value.replaceAll('-', '/');
    const endValue = document.getElementById('end').value.replaceAll('-', '/');

    const downloadUrl = `/iitp/table/export?id=${idValue}&start=${startValue}&end=${endValue}`;
    window.location.href = downloadUrl;
}