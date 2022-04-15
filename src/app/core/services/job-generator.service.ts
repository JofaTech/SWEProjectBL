import { Injectable } from '@angular/core';
import { Job } from '../models/job';

@Injectable({
  providedIn: 'root'
})
export class JobGeneratorService {
    generateRandomJob(): Job {
        // TODO: the idea here is eventually we will have some list of jobs of different tiers
        // and we will randomly choose one to make it interesting each time.
        var jobNumber = Phaser.Math.Between(1, 5);

        if (jobNumber == 1)
        {
            return new Job('Barista', 'Starbucks', 1200);
        }
        else if (jobNumber == 2)
        {
          return new Job('Shelf Stocker', 'Publix', 1000);
        }
        else if (jobNumber == 3)
        {
          return new Job('Pizza Delivery Person', 'Pizza Hut', 800);
        }
        else if (jobNumber == 4)
        {
          return new Job('Sales Professional', 'Suck It Vacuums', 1600);
        }
        else if (jobNumber == 5)
        {
          return new Job('Assistant Manager', 'Walgreens', 2000);
        }

        return new Job('Vagrant', 'The Streets', 500);
        
    }
}
