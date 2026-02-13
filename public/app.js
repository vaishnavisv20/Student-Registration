const form = document.getElementById('regForm');
const msg = document.getElementById('message');
const viewBtn = document.getElementById('viewBtn');
const listSection = document.getElementById('listSection');
const studentsTableBody = document.querySelector('#studentsTable tbody');
const closeList = document.getElementById('closeList');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = 'Submitting...';

  const payload = {
    name: document.getElementById('name').value.trim(),
    usn: document.getElementById('usn').value.trim(),
    semester: document.getElementById('semester').value,
    branch: document.getElementById('branch').value,
    email: document.getElementById('email').value.trim(),
    gender: document.getElementById('gender').value,
    overallcgpa: document.getElementById('overallcgpa').value,
    backlogs: document.getElementById('backlogs').value
  };

  // Basic client validation
  if (!payload.name || !payload.usn) {
    msg.style.color = 'red';
    msg.textContent = 'Please fill required fields.';
    return;
  }

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      msg.style.color = 'green';
      msg.textContent = 'Registered successfully!';
      form.reset();
    } else {
      msg.style.color = 'red';
      msg.textContent = data.message || 'Failed to register.';
    }
  } catch (err) {
    msg.style.color = 'red';
    msg.textContent = 'Network error. Try again.';
  }
});

viewBtn.addEventListener('click', async () => {
  listSection.classList.remove('hidden');
  studentsTableBody.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';
  try {
    const res = await fetch('/api/students');
    const data = await res.json();
    if (data.success) {
      studentsTableBody.innerHTML = data.students.map(s => 
        `<tr>
          <td>${escapeHtml(s.name)}</td>
          <td>${escapeHtml(s.usn)}</td>
          <td>${escapeHtml(s.branch)}</td>
          <td>${escapeHtml(s.semester)}</td>
          <td>${s.overallcgpa}</td>
          <td>${s.backlogs}</td>
          <td>${new Date(s.createdAt).toLocaleString()}</td>
        </tr>`
      ).join('') || '<tr><td colspan="7">No students found</td></tr>';
    } else {
      studentsTableBody.innerHTML = `<tr><td colspan="7">${escapeHtml(data.message || 'Error')}</td></tr>`;
    }
  } catch (err) {
    studentsTableBody.innerHTML = '<tr><td colspan="7">Network error</td></tr>';
  }
});

closeList.addEventListener('click', () => {
  listSection.classList.add('hidden');
});

// small helper to avoid injection when showing data
function escapeHtml(text) {
  if (!text) return '';
  return text.toString().replace(/[&<>"']/g, function(m) {
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[m];
  });
}
