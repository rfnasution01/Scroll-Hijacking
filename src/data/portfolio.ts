export const portfolio = {
	profile: {
		name: "Your Name",
		role: "Frontend Developer",
		tagline: "Fresh graduate who builds clean, fast, and human-friendly web interfaces.",
		description:
			"I turn ideas into responsive React experiences with strong attention to UI details, accessibility, and performance.",
		location: "Jakarta, Indonesia",
		resumeUrl: "/CV.pdf",
		photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=840&q=80",
	},
	socials: [
		{ label: "LinkedIn", href: "https://linkedin.com/in/username" },
		{ label: "GitHub", href: "https://github.com/username" },
		{ label: "Instagram", href: "https://instagram.com/username" },
	],
	skills: ["React", "TypeScript", "Next.js", "UI Design", "Git", "Figma"],
	experience: [
		{
			role: "Frontend Developer Intern",
			company: "Digital Studio",
			period: "2025",
			description: "Built reusable UI components and improved landing page performance with the product team.",
		},
		{
			role: "Freelance Web Developer",
			company: "Local Brands",
			period: "2024 - 2025",
			description: "Delivered responsive portfolios and business websites focused on clarity and conversion.",
		},
		{
			role: "UI/UX Division",
			company: "Campus Organization",
			period: "2023 - 2024",
			description: "Designed event pages, social assets, and design systems for student campaigns.",
		},
	],
	projects: [
		{
			title: "Campus Career Portal",
			description: "A focused job discovery interface for students with saved roles, filters, and a clean application flow.",
			tags: ["React", "TypeScript", "UI Design"],
			liveUrl: "#",
			githubUrl: "#",
			imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80",
		},
	],
	achievements: [
		{ title: "Award", value: "Best Final Project", detail: "Recognized for practical UI execution and presentation clarity." },
		{ title: "Certification", value: "Frontend Development", detail: "Completed React, web accessibility, and responsive layout modules." },
		{ title: "Competition", value: "Top 10 UI Challenge", detail: "Created a mobile-first prototype for a campus service platform." },
	],
	contact: {
		email: "hello@example.com",
		phone: "+62 812 0000 0000",
		cta: "Let’s Work Together",
	},
} as const;
