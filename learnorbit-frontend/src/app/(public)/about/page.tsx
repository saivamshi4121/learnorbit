import StaticPage from "@/components/layout/StaticPage";

export const metadata = {
    title: "About Us | LearnOrbit",
    description: "Learn about the mission and vision of LearnOrbit.",
};

export default function AboutPage() {
    return (
        <StaticPage 
            title="About Us"
            description="Our mission is to democratize high-quality tech education and empower the next generation of developers."
        />
    );
}
