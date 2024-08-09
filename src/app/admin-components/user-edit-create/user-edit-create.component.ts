import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../api-service/api.service";
import {AuthService} from "../../auth-service/auth.service";

/**
 * Component to edit and create users.
 */
@Component({
  selector: 'app-user-edit-create',
  templateUrl: './user-edit-create.component.html',
  styleUrls: ['./user-edit-create.component.scss']
})
export class UserEditCreateComponent {
  submitted = false;
  userForm: FormGroup;
  editForm: FormGroup;
  UserGender: any = ['Male', 'Female', 'Other'];
  user: any;
  isEditMode: boolean = false;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    public authService: AuthService,
    private actRoute: ActivatedRoute,
  ) {
    this.mainForm();
  }

  /**
   * Initialize the component. If an ID is present in the route parameters,
   * switch to edit mode and fetch the user data.
   */
  ngOnInit() {
    const id = this.actRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.getUser(id);
    }
  }

  /**
   * Initialize the forms for user creation and editing.
   * `userForm` is used for creating a new user, and `editForm` is used for editing an existing user.
   */
  mainForm() {
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      birthdate: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      email: [ '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],],
      location: ['', [Validators.required]],
      isAdmin: [false]
    });

    this.editForm = this.fb.group({
      username: ['', [Validators.required]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      birthdate: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      email: [ '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],],
      location: ['', [Validators.required]],
      isAdmin: [false]
    });
  }

  /**
   * Update the gender field based on the selected value.
   * @param e The selected gender.
   */
  updateGender(e) {
    this.userForm.get('gender').setValue(e, {
      onlySelf: true,
    });
    this.editForm.get('gender').setValue(e, {
      onlySelf: true,
    });
  }

  /**
   * Getter to access form controls.
   * @returns The form controls of the appropriate form based on the mode.
   */
  get myForm() {
    return this.isEditMode ? this.editForm.controls : this.userForm.controls;
  }

  /**
   * Fetch user data by ID and populate the edit form with the retrieved data.
   * @param id The ID of the user to fetch.
   */
  getUser(id) {
    this.apiService.getUser(id).subscribe((data) => {
      this.editForm.setValue({
        username: data.data['username'],
        name: data.data['name'],
        surname: data.data['surname'],
        birthdate: data.data['birthdate'],
        gender: data.data['gender'],
        email: data.data['email'],
        location: data.data['location'],
        isAdmin: data.data['isAdmin'],
      });
    });
  }

  /**
   * Handle form submission. Depending on the mode, either create a new user or update an existing user.
   */
  onSubmit() {
    this.submitted = true;
    if (this.isEditMode) {
      if (!this.editForm.valid) {
        return false;
      } else {
        let id = this.actRoute.snapshot.paramMap.get('id');
        this.apiService.updateUser(id, this.editForm.value).subscribe({
          complete: () => {
            console.log('User successfully updated!');
            alert('User successfully updated!');
            this.router.navigate(['/user-list']);
          },
          error: (e) => {
            console.log(e);
            alert('A user with the given username already exists!');
          },
        });
      }
    } else {
      if (!this.userForm.valid) {
        return false;
      } else {
        this.apiService.createUser(this.userForm.value).subscribe({
          complete: () => {
            console.log('User successfully created!');
            alert('User successfully created!');
            this.router.navigate(['/user-list']);
          },
          error: (e) => {
            console.log(e);
            alert('A user with the given username already exists!');
          },
        });
      }
    }
  }

}
