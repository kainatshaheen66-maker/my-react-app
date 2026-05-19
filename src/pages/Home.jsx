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

      {/* PRODUCTS */}
      <div className="home-container" id="products">
        {productGroups.map((group) => (
          <Link
            key={group.id}
            to={`/category/${group.id}`}
            className="home-link"
          >
            <div>
              <img
                src={group.mainImage}
                alt={group.title}
                className="home-image"
              />

              <h2 className="home-title">{group.title}</h2>
            </div>
          </Link>
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