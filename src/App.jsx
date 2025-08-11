import React, { useState, useEffect } from "react";

export default function HagridShelterApp() {
  // sample animals in the shelter
  const initialAnimals = [
    {
      id: "skrewt-1",
      name: "Boomy",
      species: "Blast-Ended Skrewt",
      age: "2 months",
      size: "sofa-sized (according to Hagrid)",
      notes:
        "A bit loud and proud. Likes marshmallows, long walks in the Forbidden Forest, and accidental combustion.",
      image:
        "https://static.wikia.nocookie.net/harrypotter/images/9/99/Blast-Ended_Skrewt_PM.png",
      available: true,
    },
    {
      id: "kneazle-1",
      name: "Smoky",
      species: "Kneazle",
      age: "4 years",
      size: "small - medium",
      notes: "Very independent. Purrs like thunder. Will sit on only one chosen lap.",
      image:
        "https://static.wikia.nocookie.net/pleasant-prefects/images/f/f6/Kneazle.jpg",
      available: true,
    },
    {
      id: "puff-1",
      name: "Puff & Fluff",
      species: "Puffskein Pair",
      age: "1 year",
      size: "tiny",
      notes: "Terrific cuddlers. Can and will eat your bogeys. Useful for nasal colds.",
      image:
        "https://static.wikia.nocookie.net/pleasant-prefects/images/1/18/Puff.jpg",
      available: true,
    },
    {
      id: "egg-1",
      name: "Shelldon",
      species: "Species unknown",
      age: "Unhatched",
      size: "medium",
      notes: "Shakes violently when exposed to punk rock music. Keep away from bright lights and loud noises to accelerate hatching. Sorry, no adoption until it's hatched.",
      image:
        "https://static.wikia.nocookie.net/harrypotter/images/a/a5/Dragon_egg_-_PAS.png",
      available: false,
    },
        {
      id: "bow-1",
      name: "Woody",
      species: "Bowtruckle",
      age: "4 Years",
      size: "medium",
      notes: "Likes to sit and climb on maple and sakura trees. Favors cool, humid environments.",
      image:
        "https://contentful.harrypotter.com/usf1vwtuqyxm/1FjnKMkfRjhBt1ZzKCFtTN/d1de91217be1c9b17021f2afaca5dcf9/bowtruckle_1_1800x1248.png",
      available: true,
    },

        {
      id: "dragon-1",
      name: "Zenith",
      species: "Hungarian Horntail",
      age: "7 Years",
      size: "very large",
      notes: "PLEASE GET THIS OFF OUR HANDS. ADOPTION BY EXPERIENCED DRAGON TAMERS ONLY.",
      image:
        "https://static0.srcdn.com/wordpress/wp-content/uploads/2019/09/Harry-Potter-Hungarian-Horntail-Dragon.jpg",
      available: true,
    },
     {
      id: "niff-1",
      name: "Pearl",
      species: "Niffler",
      age: "2 Years",
      size: "tiny",
      notes: "Loves to hoard any jewelry made of pearls.",
      image:
        "https://i.etsystatic.com/5786465/r/il/e31435/1115665146/il_570xN.1115665146_fgl0.jpg",
      available: true,
    }

 {
      id: "hippo-1",
      name: "Attila",
      species: "Hippogriff",
      age: "12 Years",
      size: "large",
      notes: "Buckbeak's child. Seen some things. Great storyteller if you speak fluent Hippogriff.",
      image:
        "https://contentful.harrypotter.com/usf1vwtuqyxm/6ojZMLbgHs47ciri1BXFPI/d225833c15e85b524e17b5013a1b30f8/hippogriff_3_1800x1248.png",
      available: true,
    }

  ];

// --- Dev-only auto reset & HMR handling ---
const APP_DATA_VERSION = 'v3'; // bump when you change data shape
const STORAGE_KEY = `hagrid_animals_${APP_DATA_VERSION}`;

if (import.meta.env.DEV) {
  // On initial load/refresh in dev, drop cached data so seeds win
  try { localStorage.removeItem(STORAGE_KEY); } catch {}

  // When this module hot-reloads, clear cache and force a full reload
  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
      import.meta.hot.invalidate(); // trigger a hard reload
    });
  }
}


const [animals, setAnimals] = useState(() => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    return cached ? JSON.parse(cached) : initialAnimals;
  } catch {
    return initialAnimals;
  }
});

useEffect(() => {
  if (!import.meta.env.DEV) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(animals));
  }
}, [animals]);


  const [query, setQuery] = useState("");
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [selected, setSelected] = useState(null); // animal selected for details
  const [showAdoptForm, setShowAdoptForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", notes: "" });
  const [statusMsg, setStatusMsg] = useState("");

  function handleSearchChange(e) {
    setQuery(e.target.value);
  }

  function filtered() {
    return animals.filter((a) => {
      const matchQuery =
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.species.toLowerCase().includes(query.toLowerCase());
      const matchAvailability = filterAvailable ? a.available : true;
      return matchQuery && matchAvailability;
    });
  }

  function openDetails(animal) {
    setSelected(animal);
    setShowAdoptForm(false);
    setForm({ name: "", email: "", notes: "" });
    setStatusMsg("");
  }

  function closeDetails() {
    setSelected(null);
    setShowAdoptForm(false);
  }

  function startAdopt(animal) {
    setSelected(animal);
    setShowAdoptForm(true);
    setStatusMsg("");
  }

  function submitAdoption(e) {
    e.preventDefault();
    // Basic validation
    if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatusMsg("Please provide your full name and a valid email address.");
      return;
    }

    // Simulate adoption: mark animal unavailable and store adopter note
    setAnimals((prev) =>
      prev.map((a) =>
        a.id === selected.id
          ? {
              ...a,
              available: false,
              adoptedBy: { name: form.name.trim(), email: form.email.trim(), notes: form.notes.trim(), date: new Date().toISOString() },
            }
          : a
      )
    );

    setStatusMsg(`Thanks, ${form.name.split(" ")[0]}! Your adoption request was recorded.`);

    // clear form but keep modal open so user can read message
    setForm({ name: "", email: "", notes: "" });
  }

  function surrenderAnimal(e) {
    // tiny form to add an animal to the shelter (Hagrid loves surprises)
    e.preventDefault();
    const formEl = e.target;
    const newAnimal = {
      id: `custom-${Date.now()}`,
      name: formEl.name.value || "Unnamed Creature",
      species: formEl.species.value || "Mysterious Creature",
      age: formEl.age.value || "unknown",
      size: formEl.size.value || "medium",
      notes: formEl.notes.value || "No notes",
      image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=60&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder",
      available: true,
    };
    setAnimals((p) => [newAnimal, ...p]);
    formEl.reset();
    setStatusMsg("Thanks — the creature has been accepted. Hagrid will give it a biscuit.");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-amber-100 to-amber-50 p-6">
      <header className="max-w-6xl mx-auto">        
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-amber-700 text-white w-14 h-14 flex items-center justify-center text-2xl font-bold">H</div>
          <div>
            <h1 className="text-3xl font-extrabold">Welcome to Rubeus Hagrid's Shelter For Magical Creatures!</h1>
            <p className="text-sm text-amber-800/80">All creatures welcome — Ministry paperwork not included.</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: search + surrender form */}
        <aside className="space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <label className="block text-sm font-medium text-amber-800">Find a creature</label>
            <input
              className="mt-2 w-full rounded-md border px-3 py-2"
              placeholder="Search name or species (e.g. Skrewt, Kneazle)"
              value={query}
              onChange={handleSearchChange}
            />
            <div className="flex items-center gap-2 mt-3">
              <input
                id="avail"
                type="checkbox"
                checked={filterAvailable}
                onChange={(e) => setFilterAvailable(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="avail" className="text-sm text-amber-900">Show only adoptable</label>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <h3 className="font-semibold text-amber-800">Surrender / Intake</h3>
            <p className="text-sm text-amber-700/80">Bringing a creature? Fill this in. Please don't leave it in the shed overnight.</p>
            <form className="mt-3 space-y-3" onSubmit={surrenderAnimal}>
              <input name="name" placeholder="Creature's name" className="w-full rounded-md border px-3 py-2" />
              <input name="species" placeholder="Species" className="w-full rounded-md border px-3 py-2" />
              <div className="flex gap-2">
                <input name="age" placeholder="Age" className="w-1/2 rounded-md border px-3 py-2" />
                <input name="size" placeholder="Size" className="w-1/2 rounded-md border px-3 py-2" />
              </div>
              <textarea name="notes" placeholder="Notes (quirks, food, etc)" className="w-full rounded-md border px-3 py-2" />
              <button className="w-full bg-amber-700 rounded-md py-2 font-semibold">Accept into Shelter</button>
            </form>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <h4 className="font-semibold text-amber-800">Status</h4>
            <p className="text-sm text-amber-700 mt-2">{statusMsg || "We are currently accepting new creatures! No muggle beasts please."}</p>
          </div>
        </aside>

        {/* Middle: animal grid */}
        <section className="lg:col-span-2">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-amber-800">Available Creatures</h2>
              <div className="text-sm text-amber-600">{filtered().length} results</div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered().map((a) => (
                <article key={a.id} className="border rounded-lg bg-amber-50">
                  <img src={a.image} alt={a.name} className="w-36 h-36 object-cover" />
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-amber-900">{a.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded ${a.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {a.available ? 'Adoptable' : 'Unavailable'}
                        </span>
                      </div>
                      <p className="text-sm text-amber-700">{a.species} • {a.age}</p>
                      <p className="mt-2 text-sm text-amber-600 truncate">{a.notes}</p>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button onClick={() => openDetails(a)} className="flex-1 border rounded-md py-1 text-sm">Details</button>
                      <button
                        onClick={() => startAdopt(a)}
                        disabled={!a.available}
                        className={`flex-1 rounded-md py-1 text-sm font-semibold ${a.available ? 'bg-amber-700' : 'bg-amber-200 text-amber-500 cursor-not-allowed'}`}>
                        Adopt
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* details / adopt modal area */}
          {selected && (
            <div className="mt-4 bg-white p-4 rounded-2xl shadow-sm">
              <div className="flex items-start gap-4">
                <img src={selected.image} alt={selected.name} className="w-40 h-40 object-cover rounded-md" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-amber-900">{selected.name}</h3>
                      <p className="text-sm text-amber-700">{selected.species} • {selected.age} • {selected.size}</p>
                    </div>
                    <div>
                      <button onClick={closeDetails} className="text-sm px-3 py-1 rounded border">Close</button>
                    </div>
                  </div>

                  <p className="mt-3 text-amber-700">{selected.notes}</p>

                  {selected.adoptedBy && (
                    <div className="mt-3 text-sm text-amber-800/80 bg-amber-50 p-2 rounded-md">
                      <strong>Adopted by:</strong> {selected.adoptedBy.name} on {new Date(selected.adoptedBy.date).toLocaleDateString()}
                    </div>
                  )}

                  {!showAdoptForm && selected.available && (
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => startAdopt(selected)} className="bg-amber-700 rounded-md px-4 py-2">Start Adoption</button>
                    </div>
                  )}

                  {!selected.available && (
                    <div className="mt-4 text-sm text-amber-700">This creature is not currently available for adoption.</div>
                  )}

                  {showAdoptForm && (
                    <form onSubmit={submitAdoption} className="mt-4 space-y-3">
                      <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your full name" className="w-full rounded-md border px-3 py-2" />
                      <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Email" className="w-full rounded-md border px-3 py-2" />
                      <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Why do you want to adopt? Any experience with magical creatures?" className="w-full rounded-md border px-3 py-2" />
                      <div className="flex gap-2">
                        <button type="submit" className="bg-green-600 px-4 py-2 rounded-md">Submit Request</button>
                        <button type="button" onClick={() => setShowAdoptForm(false)} className="border px-4 py-2 rounded-md">Cancel</button>
                      </div>
                      {statusMsg && <div className="text-sm text-amber-800 mt-2">{statusMsg}</div>}
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="max-w-6xl mx-auto mt-10 text-center text-sm text-amber-700/80">
        <p>© Rubeus Hagrid's Shelter For Magical Creatures — Website design by Hermione Granger.</p>
      </footer>
    </div>
  );
}
