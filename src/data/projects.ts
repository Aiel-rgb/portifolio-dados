export type Project = {
    id: string;
    name: string;
    github_link: string;
    site_link?: string;
    description: string;
    stacks: string;
};

/**
 * Array estático de projetos.
 * Para adicionar/editar projetos, use o painel /admin para gerar o código
 * e cole aqui.
 */
export const PROJECTS: Project[] = [
    // Adicione seus projetos aqui via /admin → "Copiar Código"
];
