import { Component, OnDestroy, OnInit } from '@angular/core';
import { PersonsEntityService } from '../../../../shared/services/states/persons-entity.service';
import { Person } from '../../../../shared/interfaces/person.interface';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { noop, of, Unsubscribable } from 'rxjs';
import { UtilsService } from '../../../../shared/services/utils.service';
import { AutoUnsubscribe, CombineSubscriptions } from '../../../../shared/decorators/auto-unsubscribe.decorator';
import { ConfirmService } from '../../../../shared/services/app-confirm/confirm.service';
import { map, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'person-profile-page',
  templateUrl: './person-profile-page.component.html',
  styleUrls: ['./person-profile-page.component.scss']
})
@AutoUnsubscribe()
export class PersonProfilePageComponent implements OnInit, OnDestroy {
  @CombineSubscriptions()
  subscribers: Unsubscribable;
  person: Person;

  personShow: {
    username: string,
    fullName: string,
    email: string;
  };

  constructor(
    private confirmService: ConfirmService,
    private utilsService: UtilsService,
    public jwtAuthService: JwtAuthService,
    private personsEntityService: PersonsEntityService) {
    this.person = this.jwtAuthService.getUser();
    this.setPerson();
    this.subscribers = this.personsEntityService.getEntityById(this.person.id).subscribe(person => {
      this.person = person;
      this.setPerson();
    });
    this.personsEntityService.selfState().subscribe(noop);
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

  setPerson() {
    this.personShow = {
      username: this.utilsService.maskCpfCnpj(this.person.username),
      fullName: `${ this.person.firstName } ${ this.person.lastName }`,
      email: this.person?.email[0].recipient,
    };
  }

  cancelAccount(): void {
    this.confirmService.confirm({
      title: 'Deseja realmente cancelar esta conta?',
      message: `
      Ao cancelar esta conta não será possível reativala novamente. Você precisará criar um novo cadastro.
      <br/><br/> Você realemente deseja continuar?
`,
      buttonCancel: {
        show: true,
        label: 'Cancelar Conta'
      },
      buttonConfirm: {
        show: true,
        label: 'Voltar'
      }
    })
      .pipe(
        take(1),
        switchMap(confirm => {
          if (confirm) {
            return this.personsEntityService.cancelAccount().pipe(
              map(() => {
                return { error: false };
              })
            );
          }
          return of({ error: true });
        })
      )
      .subscribe((error) => {
        if (error) {
          return;
        }
        this.utilsService.toast('Cliente cancelado', 'success');
      }, error => {
        this.utilsService.setError(error);
      });
  }
}
