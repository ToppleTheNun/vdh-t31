export const SiteFooter = () => (
  <footer className="py-6 md:px-8 md:py-0">
    <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
      <p className="text-muted-foreground text-center text-sm leading-loose md:text-left">
        Built by{" "}
        <a
          href="https://twitter.com/ToppleTheNun"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          ToppleTheNun
        </a>
        . The source code is available on{" "}
        <a
          href="https://github.com/ToppleTheNun/vdh-t31"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          GitHub
        </a>
        .
      </p>
    </div>
  </footer>
);
