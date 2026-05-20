import productGroups from "../data/products";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <h1>Natural Himalayan Salt Lamps</h1>

        <p>
          Bring warmth, beauty, and wellness to your home.
        </p>

        <a href="#products" className="btn">
          Explore Lamps
        </a>
      </section>

      <div className="lamps-heading-box" id="products">
        <h2 className="lamps-heading">Our Lamps</h2>
      </div>

      {/* PRODUCTS */}
<div className="home-container">
  {productGroups.map((group) => (
    <div key={group.id} className="card">
      
      {/* IMAGE (NO LINK) */}
      <img
        src={group.mainImage}
        alt={group.title}
        className="home-image"
      />

      {/* TITLE (ONLY CLICKABLE) */}
      <Link
        to={`/category/${group.id}`}
        className="home-title"
      >
        {group.title}
      </Link>

    </div>
  ))}
</div>
      <section id="benefits" className="benefits">
    <h2>Why Salt Lamps?</h2>
    <ul>
      <li>✨ Improve air quality</li>
      <li>🧘‍♀️ Promote relaxation and mood</li>
      <li>🌙 Aid in better sleep</li>
      <li>🔥 Handcrafted from natural Himalayan salt</li>
    </ul>
  </section>

    </>
  );
}

export default Home;