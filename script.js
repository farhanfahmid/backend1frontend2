// script.js

// Function to fetch data from the API
function fetchLeaderboardData() {
  fetch('http://localhost:8080/leaderboard')
    .then(response => response.json())
    .then(data => {
      populateLeaderboardTable(data);
      populateFeaturedPlayerSection(data);
      populateRecentActivitySection(data);
      populateTopCountriesSection(data);
    })
    .catch(error => console.log('Failed to fetch leaderboard data:', error));
}

// Function to populate the ranking table with data
function populateLeaderboardTable(data) {
  const leaderboardBody = document.getElementById('leaderboard-body');
  leaderboardBody.innerHTML = '';

  data.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.rank}</td>
      <td>${entry.first_name}</td>
      <td>${entry.country}</td>
      <td><img src="${entry.profile_picture}" alt="Profile Picture"></td>
      <td>${entry.total_points}</td>
    `;
    leaderboardBody.appendChild(row);
  });
}

// Function to populate the featured player section with data
function populateFeaturedPlayerSection(data) {
  const featuredPlayerSection = document.getElementById('featured-player-section');
  const featuredPlayerProfile = document.createElement('div');
  featuredPlayerProfile.id = 'featured-player-profile';

  if (data.length > 0) {
    const featuredPlayer = data[0];
    featuredPlayerProfile.innerHTML = `
      <h3>${featuredPlayer.first_name} ${featuredPlayer.last_name}</h3>
      <p>Country: ${featuredPlayer.country}</p>
      <img src="${featuredPlayer.profile_picture}" alt="Profile Picture">
      <p>Total Points: ${featuredPlayer.total_points}</p>
    `;
  } else {
    featuredPlayerProfile.textContent = 'No featured player found.';
  }

  featuredPlayerSection.appendChild(featuredPlayerProfile);
}

// Function to populate the recent activity section with data
function populateRecentActivitySection(data) {
  const recentActivitySection = document.getElementById('recent-activity-section');
  const recentActivityFeed = document.createElement('ul');
  recentActivityFeed.id = 'recent-activity-feed';

  if (data.length > 0) {
    data.slice(0, 5).forEach(entry => {
      const activityItem = document.createElement('li');
      activityItem.textContent = `${entry.first_name} ${entry.last_name} (${entry.country}) - ${entry.total_points} points`;
      recentActivityFeed.appendChild(activityItem);
    });
  } else {
    const noActivityItem = document.createElement('li');
    noActivityItem.textContent = 'No recent activity found.';
    recentActivityFeed.appendChild(noActivityItem);
  }

  recentActivitySection.appendChild(recentActivityFeed);
}

// Function to populate the top countries section with data
function populateTopCountriesSection(data) {
  const topCountriesSection = document.getElementById('top-countries-section');
  const topCountriesTable = document.createElement('table');
  topCountriesTable.id = 'top-countries-table';

  const tableHead = document.createElement('thead');
  tableHead.innerHTML = `
    <div id=top-countries-heading-style>Top Countries</div>
    <tr>
      <th>Country</th>
      <th>Total Points</th>
    </tr>
  `;
  topCountriesTable.appendChild(tableHead);

  const tableBody = document.createElement('tbody');
  tableBody.id = 'top-countries-body';

  if (data.length > 0) {
    const countries = {};
    data.forEach(entry => {
      if (entry.country in countries) {
        countries[entry.country] += entry.total_points;
      } else {
        countries[entry.country] = entry.total_points;
      }
    });

    const sortedCountries = Object.entries(countries).sort((a, b) => b[1] - a[1]);

    sortedCountries.forEach(([country, totalPoints]) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        
        <td>${country}</td>
        <td>${totalPoints}</td>
      `;
      tableBody.appendChild(row);
    });
  } else {
    const noCountriesRow = document.createElement('tr');
    const noCountriesData = document.createElement('td');
    noCountriesData.setAttribute('colspan', '2');
    noCountriesData.textContent = 'No countries found.';
    noCountriesRow.appendChild(noCountriesData);
    tableBody.appendChild(noCountriesRow);
  }

  topCountriesTable.appendChild(tableBody);
  topCountriesSection.innerHTML = '';
  topCountriesSection.appendChild(topCountriesTable);
}




// Function to handle search functionality
function handleSearch() {
  const searchInput = document.getElementById('search-input');
  const searchQuery = searchInput.value.toLowerCase();

  const rows = document.querySelectorAll('#leaderboard-body tr');
  rows.forEach(row => {
    const firstName = row.children[1].textContent.toLowerCase();
    const country = row.children[2].textContent.toLowerCase();

    if (firstName.includes(searchQuery) || country.includes(searchQuery)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// Function to handle column sorting
function handleSorting(event) {
  const column = event.target;
  const columnIndex = Array.from(column.parentNode.children).indexOf(column);
  const rows = Array.from(document.querySelectorAll('#leaderboard-body tr'));

  rows.sort((a, b) => {
    const aValue = a.children[columnIndex].textContent.toLowerCase();
    const bValue = b.children[columnIndex].textContent.toLowerCase();
    return aValue.localeCompare(bValue);
  });

  const leaderboardBody = document.getElementById('leaderboard-body');
  leaderboardBody.innerHTML = '';
  rows.forEach(row => leaderboardBody.appendChild(row));
}

// Event listeners
document.getElementById('search-input').addEventListener('input', handleSearch);
document.querySelectorAll('#leaderboard-table th').forEach(th => th.addEventListener('click', handleSorting));

// Fetch leaderboard data when the page loads
fetchLeaderboardData();
