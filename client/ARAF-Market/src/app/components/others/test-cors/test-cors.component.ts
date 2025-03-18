import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { Component } from '@angular/core';

@Component({
  selector: 'app-test-cors',
  standalone: true,
  imports: [HttpClientModule], // Add HttpClientModule here
  templateUrl: './test-cors.component.html',
  styleUrl: './test-cors.component.css'
})
export class TestCorsComponent {
  response: string = '';

  constructor(private http: HttpClient) {}

  sendRequest() {
    const url = 'http://127.0.0.1:3000/products/'; // Replace with your Express backend endpoint
    this.http.get(url).subscribe(
      (res: any) => {
        this.response = JSON.stringify(res);
      },
      (err) => {
        this.response = 'Error: ' + err.message;
        console.log(err);
      }
    );
  }
}
