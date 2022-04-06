import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, tap } from 'rxjs';
import { PokeapiService } from 'src/app/service/pokeapi.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {

  private urlPokemon: string = 'https://pokeapi.co/api/v2/pokemon'
  private urlName: string = 'https://pokeapi.co/api/v2/pokemon-species'

  public pokemon: any
  public isLoading: boolean = false
  public apiError: boolean = false

  constructor(private activatedRouter: ActivatedRoute, private pokeApiService: PokeapiService) { }

  ngOnInit(): void {
    this.getPokemon();
  }

  public getPokemon() {
    const id = this.activatedRouter.snapshot.params['id']
    const pokemon = this.pokeApiService.apiGetPokemons(`${this.urlPokemon}/${id}`)
    const name = this.pokeApiService.apiGetPokemons(`${this.urlName}/${id}`)

    return forkJoin([pokemon, name]).pipe(
      tap(res => {
        res.map((resPokemons: any) => {
          if(resPokemons.evolution_chain !== undefined) {
            this.pokeApiService.apiGetPokemons(resPokemons.evolution_chain.url).subscribe(
              res => resPokemons.evolution = res.chain)
          }
        })
      }),
    ).subscribe({
      next: res => {
        this.pokemon = res
        this.isLoading = true
      },
      error: error => {
        this.apiError = true
      }
    })
  }

}
