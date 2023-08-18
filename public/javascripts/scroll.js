let page = 1;
let loading = false;
const itemsPerPage = 30; // 페이지 당 아이템 수
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const month2 = (month < 10 ? "0" + month : month);
const day = today.getDate();
const defaultDay = `${year}-${month2}-${day}`;

function initializePage() {
    document.querySelector('#start').value = defaultDay;
    document.querySelector('#end').value = defaultDay;

    const sp = new URLSearchParams(location.search);
    if (sp.get('start')) document.querySelector('#start').value = sp.get('start').replaceAll('/', '-');
    if (sp.get('end')) document.querySelector('#end').value = sp.get('end').replaceAll('/', '-');
    if (sp.get('id')) document.querySelector('#id').value = sp.get('id');

    loadMore();
}

function loadMore() {
    if (loading) return;
    loading = true;

    const idValue = document.getElementById('id').value;
    const startValue = document.getElementById('start').value.replaceAll('-', '/');
    const endValue = document.getElementById('end').value.replaceAll('-', '/');

    const isFirstPage = page === 1; // 첫 번째 페이지인지 여부 확인

    let fetchUrl = `/iitp/load-more?page=${page}&id=${idValue}&start=${startValue}&end=${endValue}`;

    if (isFirstPage) {

        fetchUrl = `/iitp/load-more?id=${idValue}&start=${startValue}&end=${endValue}`; // 첫 번째 페이지 요청 시 page 파라미터 제외
    }

    fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('tableBody');
            if (isFirstPage) {
                container.innerHTML = ''; // 기존 데이터 초기화
            }

            if (data.length === 0 && isFirstPage) {
                // 첫 번째 페이지에서 데이터가 없는 경우 처리
                const noDataRow = document.createElement('tr');
                noDataRow.innerHTML = '<td colspan="24" class="text-center">No data available</td>';
                container.appendChild(noDataRow);
                document.getElementById('downloadButton').disabled = true; // 데이터가 없으므로 download 버튼 비활성화
                loading = false;
                return;
            }

            data.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                        <td>${index + 1 + (page - 1) * itemsPerPage}</td>
                        <td>${item.ID}</td>
                        <td class="hide-on-small-screen">${item.BATT}</td>
                        <td class="hide-on-small-screen">${item.MAGx}</td>
                        <td class="hide-on-small-screen">${item.MAGy}</td>
                        <td class="hide-on-small-screen">${item.MAGz}</td>
                        <td class="hide-on-small-screen">${item.ZYROx}</td>
                        <td class="hide-on-small-screen">${item.ZYROy}</td>
                        <td class="hide-on-small-screen">${item.ZYROz}</td>
                        <td class="hide-on-small-screen">${item.ACCx}</td>
                        <td class="hide-on-small-screen">${item.ACCy}</td>
                        <td class="hide-on-small-screen">${item.ACCz}</td>
                        <td>${item.AQI}</td>
                        <td>${item.TVOC}</td>
                        <td>${item.EC2}</td>
                        <td>${item.PM10}</td>
                        <td>${item.PM25}</td>
                        <td>${item.PM100}</td>
                        <td>${item.IRUN}</td>
                        <td>${item.RED}</td>
                        <td>${item.ECG}</td>
                        <td>${item.TEMP}</td>
                        <td>${item.CREATED_AT}</td>
                    `;
                container.appendChild(row);
            });

            if (data.length < itemsPerPage) {
                // 데이터가 페이지당 아이템 수 미만인 경우, 모든 데이터 로드 완료됨을 나타냄
                loading = true;
                document.getElementById('download').disabled = false;
            } else {
                // 다음 페이지 데이터 로드를 위해 페이지 증가
                page++;
                loading = false;
            }
        })
        .catch(error => {
            console.error('Error loading more data:', error);
            loading = false;
        });
}

window.addEventListener('scroll', () => {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMore();
        initializePage();
    }
    const scrollToTopButton = document.getElementById('scroll-to-top');

    if (window.scrollY > 150) {
        scrollToTopButton.style.display = "block";
    } else {
        scrollToTopButton.style.display = "none";
    }
});

function search() {
    // 검색 버튼 클릭 시 페이지 초기화 및 새로운 검색 실행
    const idValue = document.getElementById('id').value;
    console.log(idValue);
    const startValue = document.getElementById('start').value.replaceAll('-', '/');
    console.log(startValue);
    const endValue = document.getElementById('end').value.replaceAll('-', '/');

    const queryString = `?id=${idValue}&start=${startValue}&end=${endValue}`;
    console.log(queryString);
    location.href = `/iitp/table${queryString}`;
    // loadMore();
}

function downloadCSV() {
    const idValue = document.getElementById('id').value;
    const startValue = document.getElementById('start').value.replaceAll('-', '/');
    const endValue = document.getElementById('end').value.replaceAll('-', '/');

    const downloadUrl = `/iitp/table/export?id=${idValue}&start=${startValue}&end=${endValue}`;
    window.location.href = downloadUrl;
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}