const container = document.getElementById("electronicsContainer");
const addBtn = document.getElementById("addRow");
const limitMsg = document.getElementById("limitMessage");
const shareBtn = document.getElementById("shareBtn");
const modal = document.getElementById("qrModal");
const hourOptions = Array.from(
  { length: 24 },
  (_, i) => `<option value="${i + 1}">${i + 1} Jam</option>`
).join("");

const updateButtonStatus = () => {
  const rowCount = document.querySelectorAll(".row-item").length;
  if (rowCount >= 5) {
    addBtn.disabled = true;
    limitMsg.classList.remove("hidden");
  } else {
    addBtn.disabled = false;
    limitMsg.classList.add("hidden");
  }
};

// Modal Functions
shareBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

function closeModal() {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    closeModal();
  }
};

document.querySelector('select[name="hours"]').innerHTML = hourOptions;

addBtn.addEventListener("click", () => {
  const rowCount = document.querySelectorAll(".row-item").length;
  if (rowCount < 5) {
    const newRow = document.createElement("div");
    newRow.className =
      "row-item grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-4 bg-white rounded-xl border border-gray-100 relative shadow-sm mt-4";
    newRow.innerHTML = `
                    <div class="md:col-span-5">
                        <label class="text-xs font-semibold text-gray-500 block mb-1">Jenis Elektronik</label>
                        <input type="text" name="device" placeholder="Contoh: Lampu, TV" required class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    </div>
                    <div class="md:col-span-3">
                        <label class="text-xs font-semibold text-gray-500 block mb-1">Daya (Watt)</label>
                        <input type="number" name="watt" placeholder="0" required class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    </div>
                    <div class="md:col-span-3">
                        <label class="text-xs font-semibold text-gray-500 block mb-1">Lama (Jam)</label>
                        <select name="hours" required class="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">${hourOptions}</select>
                    </div>
                    <div class="md:col-span-1 text-right">
                        <button type="button" class="remove-btn text-red-500 hover:text-red-700 text-sm font-bold p-1">Hapus</button>
                    </div>
                `;
    container.appendChild(newRow);
    newRow.querySelector(".remove-btn").addEventListener("click", () => {
      newRow.remove();
      updateButtonStatus();
    });
    updateButtonStatus();
  }
});

const formatID = (num, decimalPlaces = 0) => {
  return num.toLocaleString("id-ID", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};

document
  .getElementById("electricForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const tarif = parseFloat(document.getElementById("tarifPilihan").value);
    const devices = document.getElementsByName("device");
    const watts = document.getElementsByName("watt");
    const hours = document.getElementsByName("hours");

    let totalWh = 0;
    let tableHTML = "";

    for (let i = 0; i < devices.length; i++) {
      const w = parseFloat(watts[i].value) || 0;
      const h = parseFloat(hours[i].value) || 0;
      const wh = w * h;
      totalWh += wh;

      tableHTML += `
                    <tr class="border-b border-gray-100 hover:bg-gray-50">
                        <td class="px-4 py-3 text-sm font-medium">${
                          devices[i].value
                        }</td>
                        <td class="px-4 py-3 text-sm text-center">${formatID(
                          w
                        )} W</td>
                        <td class="px-4 py-3 text-sm text-center">${h} Jam</td>
                        <td class="px-4 py-3 text-sm text-right font-semibold">${formatID(
                          wh
                        )} Wh</td>
                    </tr>
                `;
    }

    const totalKwh = totalWh / 1000;
    const biayaHarian = totalKwh * tarif;
    const biayaBulanan = biayaHarian * 30;

    document.getElementById("resultTableBody").innerHTML = tableHTML;
    document.getElementById("totalWh").textContent = formatID(totalWh) + " Wh";
    document.getElementById("totalKwh").textContent =
      formatID(totalKwh, 3) + " kWh";
    document.getElementById("totalBiaya").textContent =
      "Rp " + formatID(biayaHarian, 2);
    document.getElementById("totalBiayaBulan").textContent =
      "Rp " + formatID(biayaBulanan, 2);
    document.getElementById("labelTarif").textContent = formatID(tarif, 1);

    const resultSection = document.getElementById("resultSection");
    resultSection.classList.remove("hidden");
    resultSection.scrollIntoView({ behavior: "smooth" });
  });
