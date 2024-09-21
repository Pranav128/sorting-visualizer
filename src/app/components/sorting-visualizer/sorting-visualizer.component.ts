import {Component, OnInit} from '@angular/core';
import {NgFor} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-sorting-visualizer',
  standalone: true,
  imports: [NgFor,FormsModule],
  templateUrl: './sorting-visualizer.component.html',
  styleUrl: './sorting-visualizer.component.css'
})
export class SortingVisualizerComponent implements OnInit{
  array: number[] = [];
  arraySize: number = 50;
  speed: number = 50;
  selectedAlgorithm: string = 'Bubble Sort';
  algorithms: string[] = ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'Quick Sort'];
  stop: boolean = false;

  toggle(){
    this.stop=!this.stop;
  }
  constructor() {}

  ngOnInit(): void {
    this.generateArray();
  }

  generateArray(): void {
    this.array = [];
    for (let i = 0; i < this.arraySize; i++) {
      this.array.push(Math.floor(Math.random() * 400) + 5); // Random heights between 5 and 400px
    }
  }

  resetArray(): void {
    this.toggle();
    this.generateArray();
  }

  startSorting2(): void {
    this.toggle();
    if (this.selectedAlgorithm === 'Bubble Sort') {
      this.bubbleSort();
    } else if (this.selectedAlgorithm === 'Selection Sort') {
      this.selectionSort();
    } else if (this.selectedAlgorithm === 'Merge Sort') {
      this.mergeSort(this.array, 0, this.array.length - 1);
    }
    else if(this.selectedAlgorithm === 'Quick Sort'){
      this.quickSort(this.array,0,this.array.length-1);
    }
  }
  startSorting(): void {
    switch (this.selectedAlgorithm) {
      case 'Quick Sort':
        this.quickSort(this.array, 0, this.array.length - 1).then(() => {
          this.stop = true; // Set stop to true when sorting is complete
        });
        break;

      case 'Merge Sort':
        this.mergeSort(this.array, 0, this.array.length - 1).then(() => {
          this.stop = true; // Set stop to true when sorting is complete
        });
        break;

      case 'Bubble Sort':
        this.bubbleSort().then(() => {
          this.stop = true; // Set stop to true when sorting is complete
        });
        break;

      case 'Selection Sort':
        this.selectionSort().then(() => {
          this.stop = true; // Set stop to true when sorting is complete
        });
        break;


    }
  }


// Method to perform Quick Sort
  quickSort(array: number[], low: number, high: number): Promise<void> {
    return new Promise(async (resolve) => {
      if (low < high) {
        const pi = await this.partition(array, low, high);
        await this.quickSort(array, low, pi - 1); // Recursively sort left part
        await this.quickSort(array, pi + 1, high); // Recursively sort right part
      } else {
        resolve(); // Resolve when sorting is complete
      }
    });
  }

// Partition method for Quick Sort
  async partition(array: number[], low: number, high: number): Promise<number> {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]]; // Swap
        this.highlight(i, j, 'red'); // Highlight the bars
        await this.delay(this.speed); // Control speed
      }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]]; // Place pivot in correct position
    this.highlight(i + 1, high, 'red'); // Highlight the pivot
    await this.delay(this.speed); // Control speed

    return i + 1; // Return pivot index
  }



  async selectionSort() {
    const array = this.array;
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      this.highlight(minIndex, minIndex, 'red');

      for (let j = i + 1; j < n; j++) {
        this.highlight(j, j, 'yellow');  // Highlight the current index being checked
        await this.delay(this.speed);

        if (array[j] < array[minIndex]) {
          this.highlight(minIndex, minIndex, 'blue');  // Reset the previous minIndex color
          minIndex = j;
          this.highlight(minIndex, minIndex, 'red');   // Highlight new minIndex
        } else {
          this.highlight(j, j, 'blue');  // Reset the color if it's not the min
        }
      }

      // Swap the found minimum element with the first element
      if (minIndex !== i) {
        this.swap(i, minIndex);
      }

      await this.delay(this.speed);

      // Mark the sorted element
      this.highlight(i, i, 'green');
    }

    // Mark the last element as sorted
    this.highlight(n - 1, n - 1, 'green');
  }

  async mergeSort(array: number[], start: number, end: number) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    await this.mergeSort(array, start, mid);
    await this.mergeSort(array, mid + 1, end);
    await this.merge(array, start, mid, end);
  }

  async merge(array: number[], start: number, mid: number, end: number) {
    const leftArray = array.slice(start, mid + 1);
    const rightArray = array.slice(mid + 1, end + 1);

    let i = 0, j = 0, k = start;

    while (i < leftArray.length && j < rightArray.length) {
      if (leftArray[i] <= rightArray[j]) {
        this.highlight(k, k, 'red');
        array[k++] = leftArray[i++];
      } else {
        this.highlight(k, k, 'red');
        array[k++] = rightArray[j++];
      }

      await this.delay(this.speed);
      this.highlight(k - 1, k - 1, 'blue');  // Reset color
    }

    while (i < leftArray.length) {
      this.highlight(k, k, 'red');
      array[k++] = leftArray[i++];
      await this.delay(this.speed);
      this.highlight(k - 1, k - 1, 'blue');
    }

    while (j < rightArray.length) {
      this.highlight(k, k, 'red');
      array[k++] = rightArray[j++];
      await this.delay(this.speed);
      this.highlight(k - 1, k - 1, 'blue');
    }

    for (let x = start; x <= end; x++) {
      this.highlight(x, x, 'green');  // Mark sorted part in green
    }
  }


  async bubbleSort() {
    const array = this.array;
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Highlight the bars being compared
        this.highlight(j, j + 1, 'red');

        if (array[j] > array[j + 1]) {
          // Swap the elements
          this.swap(j, j + 1);
        }

        // Delay for the animation effect
        await this.delay(this.speed);

        // Reset the colors back after comparison
        this.highlight(j, j + 1, 'blue');
      }
      // Mark the last element as sorted (green)
      this.highlight(n - i - 1, n - i - 1, 'green');
    }
    // Mark the whole array as sorted
    for (let i = 0; i < n; i++) {
      this.highlight(i, i, 'green');
    }
  }

  swap(i: number, j: number) {
    const temp = this.array[i];
    this.array[i] = this.array[j];
    this.array[j] = temp;
  }

  // highlight(i: number, j: number, color: string) {
  //   const bars = document.getElementsByClassName('array-bar') as HTMLCollectionOf<HTMLElement>;
  //   bars[i].style.backgroundColor = color;
  //   bars[j].style.backgroundColor = color;
  // }

  highlight(i: number, j: number, color: string) {
    const bars = document.getElementsByClassName('array-bar') as HTMLCollectionOf<HTMLElement>;
    bars[i].style.backgroundColor = color;
    bars[j].style.backgroundColor = color;

    // Adding classes for highlight and sorted
    if (color === 'red') {
      bars[i].classList.add('highlight');
      bars[j].classList.add('highlight');
    } else {
      bars[i].classList.remove('highlight');
      bars[j].classList.remove('highlight');
    }
  }



  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
