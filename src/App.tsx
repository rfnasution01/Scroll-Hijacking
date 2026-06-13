import { portfolio } from "@/data/portfolio";

const navItems = ["about", "projects", "experience", "contact"];

function App() {
	return (
		<main className="min-h-screen bg-slate-950 text-white">
			<Navbar />
			<Hero />
			<About />
			<Projects />
			<Experience />
			<Contact />
		</main>
	);
}

function Navbar() {
	return (
		<header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
			<nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
				<a href="#hero" className="font-semibold tracking-tight">
					{portfolio.profile.name}
				</a>
				<div className="hidden gap-6 text-sm text-slate-300 sm:flex">
					{navItems.map((item) => (
						<a key={item} href={`#${item}`} className="capitalize transition hover:text-white">
							{item}
						</a>
					))}
				</div>
			</nav>
		</header>
	);
}

function Hero() {
	return (
		<section id="hero" className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr]">
			<div>
				<p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-cyan-300">
					{portfolio.profile.role}
				</p>
				<h1 className="max-w-4xl text-5xl font-bold tracking-tight text-white md:text-7xl">
					{portfolio.profile.tagline}
				</h1>
				<p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
					{portfolio.profile.description}
				</p>
				<div className="mt-8 flex flex-wrap gap-4">
					<a className="rounded-full bg-cyan-300 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200" href="#projects">
						View Projects
					</a>
					<a className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-300" href={portfolio.profile.resumeUrl}>
						Download CV
					</a>
				</div>
			</div>
			<div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/30">
				<p className="text-sm uppercase tracking-[0.3em] text-slate-400">Available for</p>
				<h2 className="mt-4 text-3xl font-semibold">Freelance, collaboration, and full-time opportunities.</h2>
				<div className="mt-8 grid gap-3 text-slate-300">
					<p>{portfolio.profile.location}</p>
					{portfolio.socials.map((social) => (
						<a key={social.label} href={social.href} className="transition hover:text-cyan-300">
							{social.label} →
						</a>
					))}
				</div>
			</div>
		</section>
	);
}

function About() {
	return (
		<section id="about" className="mx-auto max-w-6xl px-6 py-24">
			<p className="section-label">About</p>
			<div className="mt-6 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
				<h2 className="section-title">A simple portfolio template for any professional.</h2>
				<div>
					<p className="text-lg leading-8 text-slate-300">
						Use this section to introduce yourself, your process, and the value you bring. Keep it concise and focused on outcomes.
					</p>
					<div className="mt-8 flex flex-wrap gap-3">
						{portfolio.skills.map((skill) => (
							<span key={skill} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
								{skill}
							</span>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

function Projects() {
	return (
		<section id="projects" className="border-y border-white/10 bg-white/[0.03]">
			<div className="mx-auto max-w-6xl px-6 py-24">
				<p className="section-label">Projects</p>
				<h2 className="section-title mt-6">Selected work</h2>
				<div className="mt-10 grid gap-6 md:grid-cols-3">
					{portfolio.projects.map((project) => (
						<a key={project.title} href={project.link} className="rounded-3xl border border-white/10 bg-slate-950 p-6 transition hover:-translate-y-1 hover:border-cyan-300/50">
							<h3 className="text-xl font-semibold">{project.title}</h3>
							<p className="mt-4 text-sm leading-6 text-slate-300">{project.description}</p>
							<div className="mt-6 flex flex-wrap gap-2">
								{project.tags.map((tag) => (
									<span key={tag} className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs text-cyan-200">{tag}</span>
								))}
							</div>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}

function Experience() {
	return (
		<section id="experience" className="mx-auto max-w-6xl px-6 py-24">
			<p className="section-label">Experience</p>
			<h2 className="section-title mt-6">Career highlights</h2>
			<div className="mt-10 grid gap-4">
				{portfolio.experience.map((item) => (
					<div key={`${item.role}-${item.company}`} className="rounded-3xl border border-white/10 bg-white/5 p-6">
						<div className="flex flex-wrap items-start justify-between gap-3">
							<div>
								<h3 className="text-xl font-semibold">{item.role}</h3>
								<p className="text-cyan-200">{item.company}</p>
							</div>
							<span className="text-sm text-slate-400">{item.period}</span>
						</div>
						<p className="mt-4 text-slate-300">{item.description}</p>
					</div>
				))}
			</div>
		</section>
	);
}

function Contact() {
	return (
		<section id="contact" className="mx-auto max-w-6xl px-6 py-24">
			<div className="rounded-[2rem] bg-cyan-300 p-8 text-slate-950 md:p-12">
				<p className="text-sm font-semibold uppercase tracking-[0.3em]">Contact</p>
				<h2 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">{portfolio.contact.cta}</h2>
				<div className="mt-8 flex flex-wrap gap-4">
					<a className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white" href={`mailto:${portfolio.contact.email}`}>Email me</a>
					<a className="rounded-full border border-slate-950/20 px-6 py-3 font-semibold" href={`tel:${portfolio.contact.phone}`}>{portfolio.contact.phone}</a>
				</div>
			</div>
		</section>
	);
}

export default App;
