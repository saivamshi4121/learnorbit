import StaticPage from "@/components/layout/StaticPage";

export const metadata = {
    title: "Cookie Policy | LearnOrbit",
    description: "Information about how we use cookies.",
};

export default function CookiesPage() {
    return (
        <StaticPage 
            title="Cookie Policy"
            description="We use cookies to improve your experience on our platform. This policy explains how and why."
        />
    );
}
