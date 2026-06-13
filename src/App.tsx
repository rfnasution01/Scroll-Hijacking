import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { portfolio } from "@/data/portfolio";

const sections = [
	{ id: "hero", label: "Hero" },
	{ id: "about", label: "About" },
	{ id: "skills", label: "Skills" },
	{ id: "experience", label: "Experience" },
	{ id: "projects", label: "Projects" },
	{ id: "achievements", label: "Achievements" },
	{ id: "contact", label: "Contact" },
] as const;

const transitionMs = 800;

function App() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [isReducedMotion, setIsReducedMotion] = useState(false);
	const activeRef = useRef(activeIndex);
	const transitionRef = useRef(false);
	const touchStartY = useRef(0);
	const touchDeltaY = useRef(0);

	useEffect(() => {
		activeRef.current = activeIndex;
	}, [activeIndex]);

	useEffect(() => {
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setIsReducedMotion(media.matches);
		update();
		media.addEventListener("change", update);
		return () => media.removeEventListener("change", update);
	}, []);

	const goToSection = useCallback(
		(nextIndex: number) => {
			const safeIndex = Math.max(0, Math.min(sections.length - 1, nextIndex));
			if (safeIndex === activeRef.current) return;

			if (isReducedMotion) {
				setActiveIndex(safeIndex);
				document.getElementById(sections[safeIndex].id)?.scrollIntoView({ block: "start" });
				return;
			}

			if (transitionRef.current) return;
			transitionRef.current = true;
			setIsTransitioning(true);
			setActiveIndex(safeIndex);
			window.setTimeout(() => {
				transitionRef.current = false;
				setIsTransitioning(false);
			}, transitionMs);
		},
		[isReducedMotion],
	);

	useEffect(() => {
		if (isReducedMotion) return undefined;

		const handleWheel = (event: WheelEvent) => {
			event.preventDefault();
			if (Math.abs(event.deltaY) < 10) return;
			goToSection(activeRef.current + (event.deltaY > 0 ? 1 : -1));
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (["ArrowDown", "PageDown"].includes(event.key)) {
				event.preventDefault();
				goToSection(activeRef.current + 1);
			}
			if (["ArrowUp", "PageUp"].includes(event.key)) {
				event.preventDefault();
				goToSection(activeRef.current - 1);
			}
		};

		const handleTouchStart = (event: TouchEvent) => {
			touchStartY.current = event.touches[0]?.clientY ?? 0;
			touchDeltaY.current = 0;
		};

		const handleTouchMove = (event: TouchEvent) => {
			touchDeltaY.current = (event.touches[0]?.clientY ?? touchStartY.current) - touchStartY.current;
			event.preventDefault();
		};

		const handleTouchEnd = () => {
			if (Math.abs(touchDeltaY.current) < 50) return;
			goToSection(activeRef.current + (touchDeltaY.current < 0 ? 1 : -1));
		};

		window.addEventListener("wheel", handleWheel, { passive: false });
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("touchstart", handleTouchStart, { passive: true });
		window.addEventListener("touchmove", handleTouchMove, { passive: false });
		window.addEventListener("touchend", handleTouchEnd);

		return () => {
			window.removeEventListener("wheel", handleWheel);
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("touchstart", handleTouchStart);
			window.removeEventListener("touchmove", handleTouchMove);
			window.removeEventListener("touchend", handleTouchEnd);
		};
	}, [goToSection, isReducedMotion]);

	return (
		<main className="portfolio-shell bg-[#0A0A0A] text-white" style={{ "--active-section": activeIndex } as CSSProperties}>
			<Navbar activeIndex={activeIndex} onNavigate={goToSection} />
			<div className="sections-track">
				<Hero active={activeIndex === 0} onViewProjects={() => goToSection(4)} />
				<About active={activeIndex === 1} />
				<Skills active={activeIndex === 2} />
				<Experience active={activeIndex === 3} />
				<Projects active={activeIndex === 4} />
				<Achievements active={activeIndex === 5} />
				<Contact active={activeIndex === 6} />
			</div>
			<DotNavigation activeIndex={activeIndex} isTransitioning={isTransitioning} onNavigate={goToSection} />
		</main>
	);
}

function Navbar({ activeIndex, onNavigate }: { activeIndex: number; onNavigate: (index: number) => void }) {
	return (
		<header className={`site-nav ${activeIndex > 0 ? "site-nav--solid" : ""}`}>
			<nav className="container-shell flex items-center justify-between py-5">
				<button className="font-bold tracking-tight" type="button" onClick={() => onNavigate(0)}>
					{portfolio.profile.name}
				</button>
				<div className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
					{sections.slice(1).map((section, index) => (
						<button key={section.id} className="transition hover:text-[#00D4FF]" type="button" onClick={() => onNavigate(index + 1)}>
							{section.label}
						</button>
					))}
				</div>
			</nav>
		</header>
	);
}

function DotNavigation({ activeIndex, isTransitioning, onNavigate }: { activeIndex: number; isTransitioning: boolean; onNavigate: (index: number) => void }) {
	return (
		<nav className="dot-nav" aria-label="Section navigation">
			{sections.map((section, index) => (
				<button
					key={section.id}
					aria-label={`Go to ${section.label}`}
					aria-current={activeIndex === index ? "true" : undefined}
					className={`dot ${activeIndex === index ? "dot--active" : ""} ${isTransitioning && activeIndex === index ? "dot--pulse" : ""}`}
					type="button"
					onClick={() => onNavigate(index)}
				/>
			))}
		</nav>
	);
}

function Hero({ active, onViewProjects }: { active: boolean; onViewProjects: () => void }) {
	return (
		<section id="hero" className={`full-section grid place-items-center text-center ${active ? "is-active" : ""}`} aria-labelledby="hero-title">
			<div className="container-shell section-grid">
				<div className="col-span-12">
					<h1 id="hero-title" className="stagger text-[clamp(2.5rem,8vw,4.5rem)] font-bold leading-[1.2] tracking-tight">
						{portfolio.profile.name}
					</h1>
					<p className="stagger mt-4 text-xl font-semibold text-[#00D4FF] md:text-2xl">{portfolio.profile.role}</p>
					<p className="stagger mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">{portfolio.profile.tagline}</p>
					<button className="primary-button stagger mt-9" type="button" onClick={onViewProjects}>
						View Projects
					</button>
					<div className="mouse-cue stagger mx-auto mt-14" aria-hidden="true" />
				</div>
			</div>
		</section>
	);
}

function About({ active }: { active: boolean }) {
	return (
		<section id="about" className={`full-section ${active ? "is-active" : ""}`} aria-labelledby="about-title">
			<div className="container-shell section-grid items-center">
				<div className="stagger col-span-12 lg:col-span-5">
					<img className="profile-photo" src={portfolio.profile.photoUrl} alt={portfolio.profile.name} loading="lazy" />
				</div>
				<div className="col-span-12 lg:col-span-7">
					<p className="section-label stagger">About</p>
					<h2 id="about-title" className="section-title stagger mt-4">I design and build interfaces that help users move faster.</h2>
					<p className="stagger mt-6 max-w-2xl text-lg leading-8 text-zinc-400">{portfolio.profile.description}</p>
					<p className="stagger mt-4 max-w-2xl text-lg leading-8 text-zinc-400">My strongest stack is React, TypeScript, Figma, and Git for turning UI ideas into production-ready pages.</p>
					<a className="primary-button stagger mt-8 inline-flex" href={portfolio.profile.resumeUrl}>Download CV</a>
				</div>
			</div>
		</section>
	);
}

function Skills({ active }: { active: boolean }) {
	return (
		<section id="skills" className={`full-section grid place-items-center ${active ? "is-active" : ""}`} aria-labelledby="skills-title">
			<div className="container-shell text-center">
				<p className="section-label stagger">Skills</p>
				<h2 id="skills-title" className="section-title stagger mx-auto mt-4">Tools I use to build modern web products.</h2>
				<div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
					{portfolio.skills.map((skill) => (
						<div key={skill} className="skill-block stagger">{skill}</div>
					))}
				</div>
			</div>
		</section>
	);
}

function Experience({ active }: { active: boolean }) {
	return (
		<section id="experience" className={`full-section ${active ? "is-active" : ""}`} aria-labelledby="experience-title">
			<div className="container-shell section-grid items-center">
				<div className="col-span-12 lg:col-span-5">
					<p className="section-label stagger">Experience</p>
					<h2 id="experience-title" className="section-title stagger mt-4">A growing track record through real collaboration.</h2>
				</div>
				<div className="timeline col-span-12 lg:col-span-7">
					{portfolio.experience.map((item) => (
						<article key={`${item.role}-${item.company}`} className="timeline-item stagger">
							<span>{item.period}</span>
							<h3>{item.role}</h3>
							<p>{item.company} — {item.description}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

function Projects({ active }: { active: boolean }) {
	const project = portfolio.projects[0];

	return (
		<section id="projects" className={`full-section ${active ? "is-active" : ""}`} aria-labelledby="projects-title">
			<div className="container-shell section-grid items-center">
				<div className="stagger col-span-12 lg:col-span-7">
					<img className="project-image" src={project.imageUrl} alt={project.title} loading="lazy" />
				</div>
				<div className="col-span-12 lg:col-span-5">
					<p className="section-label stagger">Featured Project</p>
					<h2 id="projects-title" className="section-title stagger mt-4">{project.title}</h2>
					<p className="stagger mt-6 text-lg leading-8 text-zinc-400">{project.description}</p>
					<div className="stagger mt-6 flex flex-wrap gap-2">
						{project.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
					</div>
					<div className="stagger mt-8 flex flex-wrap gap-4">
						<a className="primary-button" href={project.liveUrl}>View Live</a>
						<a className="ghost-button" href={project.githubUrl}>View Github</a>
					</div>
				</div>
			</div>
		</section>
	);
}

function Achievements({ active }: { active: boolean }) {
	return (
		<section id="achievements" className={`full-section grid place-items-center ${active ? "is-active" : ""}`} aria-labelledby="achievements-title">
			<div className="container-shell text-center">
				<p className="section-label stagger">Achievements</p>
				<h2 id="achievements-title" className="section-title stagger mx-auto mt-4">Signals of consistency, learning, and initiative.</h2>
				<div className="mt-10 grid gap-5 md:grid-cols-3">
					{portfolio.achievements.map((item) => (
						<article key={item.title} className="achievement-card stagger">
							<p>{item.title}</p>
							<h3>{item.value}</h3>
							<span>{item.detail}</span>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

function Contact({ active }: { active: boolean }) {
	return (
		<section id="contact" className={`full-section grid place-items-center text-center ${active ? "is-active" : ""}`} aria-labelledby="contact-title">
			<div className="container-shell">
				<p className="section-label stagger">Contact</p>
				<h2 id="contact-title" className="stagger mt-4 text-[clamp(2rem,6vw,4.5rem)] font-bold leading-[1.2]">{portfolio.contact.cta}</h2>
				<form className="stagger mx-auto mt-10 grid max-w-xl gap-4" action={`mailto:${portfolio.contact.email}`}>
					<input aria-label="Name" name="name" placeholder="Name" />
					<input aria-label="Email" name="email" placeholder="Email" type="email" />
					<button className="primary-button justify-center" type="submit">Send Message</button>
				</form>
				<div className="stagger mt-8 flex justify-center gap-6 text-zinc-400">
					{portfolio.socials.map((social) => <a key={social.label} className="hover:text-[#00D4FF]" href={social.href}>{social.label}</a>)}
				</div>
			</div>
		</section>
	);
}

export default App;
