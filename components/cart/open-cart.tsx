import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import clsx from 'clsx';

export default function OpenCart({
                                     className,
                                     quantity,
                                 }: {
    className?: string;
    quantity?: number;
}) {
    return (
        <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-theme text-theme-strong transition-colors dark:border-theme dark:text-theme-strong">
            <ShoppingCartIcon
                fontSize="small"
                className={clsx(
                    'transition-all ease-in-out hover:scale-110',
                    className,
                )}
            />

            {quantity ? (
                <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded-sm bg-blue-600 text-[11px] font-medium text-white">
                    {quantity}
                </div>
            ) : null}
        </div>
    );
}