import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

const destinations = [
  { city: "Lisbon", country: "Portugal", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=600&q=80" },
  { city: "Kyoto", country: "Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80" },
  { city: "Cape Town", country: "South Africa", image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=600&q=80" },
  { city: "Reykjavik", country: "Iceland", image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=600&q=80" },
];

const trips = [
  { title: "Amalfi Coast Escape", date: "12 - 19 Jun 2025", location: "Italy", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=80", status: "Planning" },
  { title: "Autumn in Tokyo", date: "04 - 14 Oct 2025", location: "Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80", status: "Draft" },
  { title: "New York Weekend", date: "21 - 24 Nov 2024", location: "United States", image: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=900&q=80", status: "Completed" },
];

export default function Home() {
  return (
    <div id="top" className="app-shell">
      <Nav />
      <main className="dashboard">
        <section className="welcome-row" id="overview">
          <div>
            <p className="eyebrow">Friday, 18 April 2025</p>
            <h1>Good morning, Alex <span aria-hidden="true">✈</span></h1>
            <p className="welcome-copy">Your next adventure is closer than you think.</p>
          </div>
          <a className="primary-button" href="#plan"><span aria-hidden="true">＋</span> Plan a new trip</a>
        </section>

        <section className="hero-banner" aria-label="Travel inspiration">
          <div className="hero-content">
            <p className="eyebrow light">MAKE ROOM FOR WONDER</p>
            <h2>Where will you<br />go next?</h2>
            <a className="light-button" href="#explore">Explore destinations <span aria-hidden="true">→</span></a>
          </div>
        </section>

        <section className="section-block" id="trips">
          <div className="section-heading"><div><p className="eyebrow">YOUR JOURNEY</p><h2>Recent trips</h2></div><a href="#trips">View all <span aria-hidden="true">→</span></a></div>
          <div className="trip-grid">
            {trips.map((trip) => <article className="trip-card" key={trip.title}><div className="trip-image" style={{ backgroundImage: `url(${trip.image})` }}><span className={`status ${trip.status.toLowerCase()}`}>{trip.status}</span></div><div className="trip-details"><h3>{trip.title}</h3><p><span aria-hidden="true">◷</span> {trip.date}</p><p><span aria-hidden="true">⌖</span> {trip.location}</p></div></article>)}
          </div>
        </section>

        <section className="lower-grid">
          <div className="section-block" id="explore"><div className="section-heading"><div><p className="eyebrow">GET INSPIRED</p><h2>Popular destinations</h2></div><a href="#explore">See more <span aria-hidden="true">→</span></a></div><div className="destination-grid">{destinations.map((destination) => <a className="destination-card" href="#explore" key={destination.city}><div className="destination-image" style={{ backgroundImage: `url(${destination.image})` }} /><div><h3>{destination.city}</h3><p>{destination.country}</p></div></a>)}</div></div>
          <aside className="budget-card"><div className="section-heading"><div><p className="eyebrow">TRIP BUDGET</p><h2>Budget snapshot</h2></div><span className="more-icon" aria-hidden="true">•••</span></div><div className="budget-amount"><strong>$1,240</strong><span>of $2,000 planned</span></div><div className="progress-track"><span /></div><div className="budget-footer"><span>60% allocated</span><b>+$760 available</b></div></aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
