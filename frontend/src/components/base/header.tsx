const Header = ({ title }: { title: string }) => {
    return (
        <div className="flex flex-col gap-1 mt-8 mb-6">
            <h1 className="text-2xl font-semibold tracking-[-0.96px]">{title}</h1>
        </div>
    );
};

export default Header;
