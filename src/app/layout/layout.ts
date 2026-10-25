import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Sidebar } from './sidebar/sidebar';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';


@Component({
  imports: [RouterOutlet, Header, Sidebar, HlmSidebarImports,],
  selector: 'app-layout',
  templateUrl: './layout.html',
})
export class Layout {

}
