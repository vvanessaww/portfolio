import DeskScene from '../components/DeskScene'

function Home() {
  const handleObjectClick = (objectName) => {
    console.log(`Object clicked: ${objectName}`)
    // TODO: Add routing based on object
    // - laptop -> /projects
    // - postcard -> /strava (travel/adventures)
    // - notebook -> /writing
  }

  return (
    <div className="page home-page">
      <div className="hero-section">
        <DeskScene onObjectClick={handleObjectClick} />
        <div className="hero-overlay">
          <h1>Welcome</h1>
          <p className="hero-subtitle">Explore my desk — click the objects to navigate</p>
        </div>
      </div>
    </div>
  )
}

export default Home
