"use client";

import { useEffect, useState } from "react";
import CircularGallery from "./CircularGallery";

type Certificate = {
    id: string;
    image: string;
    link?: string;
    text: string;
};

export default function CertificatesSection() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/certificates")
            .then((res) => res.json())
            .then((data) => setCertificates(data))
            .catch(() => setCertificates([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading || certificates.length === 0) return null;

    const galleryItems = certificates.map(c => ({
        image: c.image || c.link || "",
        link: c.link || c.image || "",
        text: c.text
    }));

    return (
        <section id="certificados" className="relative z-10 mx-auto max-w-5xl px-6 pb-32 md:px-10">
            <div className="mb-12 space-y-4">
                <h2 className="text-4xl font-bold tracking-tight text-white">Meus <span className="text-(--color-accent)">Certificados</span></h2>
                <p className="text-white/60 text-sm max-w-xl">
                    Ensino e especializações para fundamentação teórica e profissional.
                </p>
            </div>

            <div className="h-[600px] w-full rounded-[3rem] overflow-hidden border border-white/5 bg-black/50 backdrop-blur-sm relative">
                <CircularGallery items={galleryItems} bend={3} textColor="#ffffff" borderRadius={0.05} font="bold 30px Figtree" scrollSpeed={2} scrollEase={0.05} />

                {/* Overlay gradient for premium feel */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#050506] to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-[#050506] to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-[#050506] to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-[#050506] to-transparent pointer-events-none" />
            </div>
        </section>
    );
}
