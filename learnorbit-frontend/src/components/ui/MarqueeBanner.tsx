import React from "react";

export function MarqueeBanner() {
    const items = [
        {
            text: "Early Access Available - Be the first to join!",
            icon: "🚀",
            highlight: true
        },
        {
            text: "New Advanced React Patterns Course Live",
            icon: "✨",
            highlight: false
        },
        {
            text: "Join 50,000+ Developers learning today",
            icon: "👥",
            highlight: false
        },
        {
            text: "Get Certified and land your dream job",
            icon: "🎓",
            highlight: false
        }
    ];

    // Create a long strip of items to ensure it fills even large screens
    // We repeat the base items 4 times to form "one set" that is definitely wider than any screen
    const marqueeSet = (
        <div className="flex items-center gap-12 shrink-0 px-6">
            {[...items, ...items, ...items, ...items].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium whitespace-nowrap">
                    <span className="text-lg">{item.icon}</span>
                    <span className={item.highlight ? "text-white font-bold" : "text-blue-100"}>
                        {item.text}
                    </span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="bg-gradient-to-r from-blue-900/95 via-primary/95 to-blue-900/95 backdrop-blur-sm text-white border-b border-white/10 relative z-[60] overflow-hidden">
            <div className="flex py-2.5 animate-marquee">
                {marqueeSet}
                {marqueeSet}
            </div>

            {/* Optional: Close button or CTA could go here, floating above */}
        </div>
    );
}
