/**
 * v0 by Vercel.
 * @see https://v0.dev/t/XWWEapvOFOb
 */
import { Button } from '@/components/ui/button';
import { PopoverTrigger, PopoverContent, Popover } from '@/components/ui/popover';
import { CommandInput, CommandEmpty, CommandItem, CommandGroup, CommandList, Command } from '@/components/ui/command';

export default function Component() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-[240px] justify-start text-left font-normal" variant="outline">
          <TextIcon className="mr-1 h-4 w-4 -translate-x-1" />
          Pick a font
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Command>
          <CommandInput autoFocus className="h-9" placeholder="Search fonts..." />
          <CommandList>
            <CommandEmpty>No font found.</CommandEmpty>
            <CommandGroup>
              <CommandItem>
                <div className="flex items-center gap-2">
                  <span className="font-sans">Arial</span>
                  <span className="font-sans">AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz</span>
                </div>
              </CommandItem>
              <CommandItem>
                <div className="flex items-center gap-2">
                  <span className="font-serif">Times New Roman</span>
                  <span className="font-serif">AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz</span>
                </div>
              </CommandItem>
              <CommandItem>
                <div className="flex items-center gap-2">
                  <span className="font-mono">Courier New</span>
                  <span className="font-mono">AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz</span>
                </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function TextIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 6.1H3" />
      <path d="M21 12.1H3" />
      <path d="M15.1 18H3" />
    </svg>
  );
}
