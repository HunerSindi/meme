// NavBar.tsx
import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";
import { useLang } from './langContext';
import SvgMenuIcon from "./assets/icons/bars-staggered.png";

function NavBar() {
  const { currentLang, lang, langUrl, changeName } = useLang();

  const krdFlag: string = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Flag_of_Kurdistan.svg/1200px-Flag_of_Kurdistan.svg.png";
  const arFlag: string = "https://cdn.britannica.com/79/5779-050-46C999AF/Flag-Saudi-Arabia.jpg";
  const engFlag: string = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/1200px-Flag_of_the_United_Kingdom_%283-5%29.svg.png";

  return (
    <header className="nav-bar-header">
      <Drawer>
        <DrawerTrigger>
            <div className='nav-bar-lang'>
                <img width={20} className='svg-burger' src={langUrl} alt="Image" /> <p>{lang}</p> 
            </div>
          
        </DrawerTrigger>
        <DrawerContent>
          <DrawerFooter>
            <DrawerClose>
            <div className='nav-bar-lang'>
              <img width={20} src={krdFlag} alt="Kurdish Image" />
              <p className='lang' onClick={() => changeName('KURDISH', krdFlag,"krd")}>KURDISH</p>
            </div>  
            </DrawerClose>
            <DrawerClose>
            <div className='nav-bar-lang'>
              <img width={20} src={arFlag} alt="Arabic Image" />
              <p className='lang' onClick={() => changeName('ARABIC', arFlag,"ar")}>ARABIC</p>
            </div>  
            </DrawerClose>
            <DrawerClose>
            <div className='nav-bar-lang'>
              <img width={20} src={engFlag} alt="English Image" />
              <p className='lang' onClick={() => changeName('ENGLISH', engFlag,"eng")}>ENGLISH</p>
            </div>  
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Sheet>

      <SheetTrigger><img width={20} src={SvgMenuIcon} alt="menu icon" /></SheetTrigger>
        <SheetContent>
            <SheetHeader>
            <SheetTitle>TOX SAMPLE</SheetTitle>
            <SheetDescription>
                <li><a href="/home">Some Links </a></li>
                <li><a href="/login">Some Links </a></li>
                <li><a href="/home">Some Links </a></li>
                <li><a href="/home">Some Links </a></li>
                <li><a href="/home">Some Links </a></li>
                <li><a href="/home">Some Links </a></li>
            </SheetDescription>
            </SheetHeader>
        </SheetContent>
        </Sheet>
    </header>
  )
}

export default NavBar;
