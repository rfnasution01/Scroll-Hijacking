import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { portfolio } from "@/data/portfolio";

const transitionMs = 1000;

type PortfolioSection = (typeof portfolio.sections)[number];

function App() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const [motionSkipped, setMotionSkipped] = useState(false);
	const [isDesktop, setIsDesktop] = useState(() => (typeof window === "undefined" ? true : window.innerWidth > 1024));
	const activeRef = useRef(activeIndex);
	const animatingRef = useRef(false);
	const touchStartY = useRef(0);
	const sections = portfolio.sections;
	const hijackEnabled = isDesktop && !motionSkipped;

	useEffect(() => {
		activeRef.current = activeIndex;
	}, [activeIndex]);

	useEffect(() => {
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => {
			setIsDesktop(window.innerWidth > 1024);
			setMotionSkipped((current) => current || media.matches);
		};
		update();
		window.addEventListener("resize", update);
		media.addEventListener("change", update);
		return () => {
			window.removeEventListener("resize", update);
			media.removeEventListener("change", update);
		};
	}, []);

	useEffect(() => {
		document.documentElement.classList.toggle("has-scroll-hijack", hijackEnabled);
		document.body.classList.toggle("has-scroll-hijack", hijackEnabled);
		return () => {
			document.documentElement.classList.remove("has-scroll-hijack");
			document.body.classList.remove("has-scroll-hijack");
		};
	}, [hijackEnabled]);

	const goToSection = useCallback(
		(nextIndex: number) => {
			const safeIndex = Math.max(0, Math.min(sections.length - 1, nextIndex));
			if (safeIndex === activeRef.current) return;

			if (!hijackEnabled) {
				document.getElementById(sections[safeIndex].id)?.scrollIntoView({ behavior: motionSkipped ? "auto" : "smooth", block: "start" });
				setActiveIndex(safeIndex);
				history.pushState(null, "", `#${sections[safeIndex].id}`);
				return;
			}

			if (animatingRef.current) return;
			animatingRef.current = true;
			setIsAnimating(true);
			setActiveIndex(safeIndex);
			history.pushState(null, "", `#${sections[safeIndex].id}`);
			window.setTimeout(() => {
				animatingRef.current = false;
				setIsAnimating(false);
			}, transitionMs);
		},
		[hijackEnabled, motionSkipped, sections],
	);

	useEffect(() => {
		if (!hijackEnabled) return undefined;

		const onWheel = (event: WheelEvent) => {
			event.preventDefault();
			if (Math.abs(event.deltaY) <= 10) return;
			goToSection(activeRef.current + (event.deltaY > 0 ? 1 : -1));
		};
		const onKeyDown = (event: KeyboardEvent) => {
			if (["ArrowDown", "PageDown", " "].includes(event.key)) {
				event.preventDefault();
				goToSection(activeRef.current + 1);
			}
			if (["ArrowUp", "PageUp"].includes(event.key)) {
				event.preventDefault();
				goToSection(activeRef.current - 1);
			}
		};
		const onTouchStart = (event: TouchEvent) => {
			touchStartY.current = event.touches[0]?.clientY ?? 0;
		};
		const onTouchEnd = (event: TouchEvent) => {
			const touchEndY = event.changedTouches[0]?.clientY ?? touchStartY.current;
			const delta = touchStartY.current - touchEndY;
			if (Math.abs(delta) > 50) goToSection(activeRef.current + (delta > 0 ? 1 : -1));
		};

		window.addEventListener("wheel", onWheel, { passive: false });
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("touchstart", onTouchStart, { passive: true });
		window.addEventListener("touchend", onTouchEnd, { passive: false });
		return () => {
			window.removeEventListener("wheel", onWheel);
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("touchstart", onTouchStart);
			window.removeEventListener("touchend", onTouchEnd);
		};
	}, [goToSection, hijackEnabled]);

	useEffect(() => {
		if (hijackEnabled) return undefined;
		const observers = sections.map((section, index) => {
			const node = document.getElementById(section.id);
			if (!node) return undefined;
			const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setActiveIndex(index), { threshold: 0.55 });
			observer.observe(node);
			return observer;
		});
		return () => observers.forEach((observer) => observer?.disconnect());
	}, [hijackEnabled, sections]);

	const themeClass = useMemo(() => `theme-${sections[activeIndex]?.theme ?? "dark"}`, [activeIndex, sections]);

	return (
		<>
			<Preloader />
			<button className="skip-animation-btn" type="button" onClick={() => setMotionSkipped(true)}>
				Skip Motion
			</button>
			<Navbar activeIndex={activeIndex} onNavigate={goToSection} />
			<main className={`scroll-container ${themeClass} ${hijackEnabled ? "is-hijacked" : "is-native"}`}>
				{sections.map((section, index) => (
					<PortfolioSlide key={section.id} section={section} active={activeIndex === index} index={index} goToSection={goToSection} />
				))}
			</main>
			<ProgressDots activeIndex={activeIndex} isAnimating={isAnimating} onNavigate={goToSection} />
		</>
	);
}

function Preloader() {
	const [loaded, setLoaded] = useState(false);
	useEffect(() => {
		const timer = window.setTimeout(() => setLoaded(true), 900);
		return () => window.clearTimeout(timer);
	}, []);
	return <div id="preloader" className={loaded ? "is-loaded" : ""}><span>INITIALIZING CONTEXT...</span></div>;
}

function Navbar({ activeIndex, onNavigate }: { activeIndex: number; onNavigate: (index: number) => void }) {
	return (
		<nav className={`navbar ${portfolio.sections[activeIndex]?.theme === "light" ? "navbar-light" : ""}`} aria-label="Global navigation">
			<button className="nav-logo" type="button" onClick={() => onNavigate(0)}>{portfolio.brand.studio}</button>
			<div className="nav-links">
				{portfolio.navigation.map((item) => {
					const index = portfolio.sections.findIndex((section) => section.id === item.target);
					return <button key={item.target} className={activeIndex === index ? "active" : ""} type="button" onClick={() => onNavigate(index)}>{item.label}</button>;
				})}
			</div>
		</nav>
	);
}

function ProgressDots({ activeIndex, isAnimating, onNavigate }: { activeIndex: number; isAnimating: boolean; onNavigate: (index: number) => void }) {
	return (
		<nav className="progress-dots" aria-label="Section progress">
			{portfolio.sections.map((section, index) => (
				<button key={section.id} aria-label={`Go to ${section.id}`} aria-current={activeIndex === index ? "true" : undefined} className={`dot ${activeIndex === index ? "active" : ""} ${isAnimating && activeIndex === index ? "pulse" : ""}`} type="button" onClick={() => onNavigate(index)} />
			))}
		</nav>
	);
}

function PortfolioSlide({ section, active, index, goToSection }: { section: PortfolioSection; active: boolean; index: number; goToSection: (index: number) => void }) {
	const className = `snap-section bg-${section.theme} ${active ? "active-render" : ""}`;

	if (section.type === "hero") {
		return <section id={section.id} className={className} aria-labelledby="hero-title"><div className="container-center"><h1 id="hero-title" className="display-h1 animate-target">{section.title}</h1><p className="hero-copy">{section.statement}</p><p className="caption tracking-wide">{section.caption}</p><button className="scroll-hint" type="button" onClick={() => goToSection(index + 1)}>{section.hint}</button></div></section>;
	}
	if (section.type === "about") {
		return <section id={section.id} className={className} aria-labelledby="about-title"><div className="split-wrapper"><div className="left-col overflow-hidden"><img src={section.image} className="parallax-img" alt={section.imageAlt} /></div><div className="right-col layout-center"><h2 id="about-title" className="display-h2 split-title">{section.words.map((word) => <span key={word} className="split-word">{word}</span>)}</h2><p className="body-copy">{section.statement}</p></div></div></section>;
	}
	if (section.type === "work-video") {
		return <section id={section.id} className={className} aria-labelledby={`${section.id}-title`}><video src={section.video} poster={section.poster} autoPlay loop muted playsInline className="bg-media" /><div className="overlay-grad" /><div className="work-details block-bottom-left"><span className="caption">{section.caption}</span><h2 id={`${section.id}-title`} className="display-h2">{section.title}</h2><p className="body-copy">{section.statement}</p></div><div className="block-top-right"><span className="tag">{section.tag}</span></div></section>;
	}
	if (section.type === "work-image") {
		return <section id={section.id} className={className} aria-labelledby={`${section.id}-title`}><img src={section.image} alt={section.imageAlt} className="bg-media" /><div className="overlay-grad" /><div className="work-details block-bottom-right"><span className="caption">{section.caption}</span><h2 id={`${section.id}-title`} className="display-h2">{section.title}</h2><p className="body-copy">{section.statement}</p></div><div className="block-top-left"><span className="tag">{section.tag}</span></div></section>;
	}
	if (section.type === "work-center") {
		return <section id={section.id} className={className} aria-labelledby={`${section.id}-title`}><div className="container-center"><p className="caption">{section.caption}</p><div className="center-showcase"><img src={section.image} className="animate-target" alt={section.imageAlt} /></div><h2 id={`${section.id}-title`} className="display-h2 text-center">{section.title}</h2><p className="body-copy text-center">{section.statement}</p></div></section>;
	}
	if (section.type === "skills") {
		return <section id={section.id} className={className} aria-labelledby="skills-title"><div className="skills-content"><p className="caption">{section.title}</p><p className="body-copy">{section.statement}</p><div className="grid-4x2-container">{section.items.map((item) => <div key={item} className="grid-item"><h3>{item}</h3></div>)}</div></div></section>;
	}
	if (section.type === "testimonial") {
		return <section id={section.id} className={className} aria-label="Testimonial"><div className="container-center padding-80"><p className="quote-text">“{section.quote}”</p><span className="caption text-muted">{section.caption}</span></div></section>;
	}
	return <section id={section.id} className={className} aria-labelledby="contact-title"><div className="container-center"><p className="body-copy text-center">{section.statement}</p><h1 id="contact-title" className="contact-title display-h1">{section.title}</h1><a href={`mailto:${section.email.toLowerCase()}`} className="huge-email-link">{section.email}</a></div><footer className="footer-minimal"><span>{section.footerLeft}</span><button type="button" onClick={() => goToSection(0)}>{section.footerRight}</button></footer></section>;
}

export default App;
