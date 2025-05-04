import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import {provideHttpClient} from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected videogame', (done: DoneFn) => {
    service.getVideogame(533).subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.status).toBe(200);
      expect(response.apiResponse[0].id).toEqual(533);
      expect(response.apiResponse[0].name).toEqual("Dishonored");
      done();
    });
  });

  it('should return expected videogame profile', (done: DoneFn) => {
    service.getVideogameProfile(533).subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.status).toBe(200);
      const apiResponse = response.apiResponse;
      expect(apiResponse.length).toEqual(2);
      expect(apiResponse[0].name).toEqual("Info de Juego");
      expect(apiResponse[1].name).toEqual("Portada de Juego");
      expect(apiResponse[0].result[0].id).toEqual(533);
      expect(apiResponse[1].result[0].game).toEqual(533);
      done();
    });
  });

  it('should return expected number of search results according to specified limit', (done: DoneFn) => {
    service.search(10, "D").subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.status).toBe(200);
      const apiResponse = response.apiResponse;
      expect(apiResponse.length).toEqual(10);
      done();
    });
  });

  it('should return expected results when using title search', (done: DoneFn) => {
    service.search(10, "Dishonored").subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.status).toBe(200);
      const apiResponse = response.apiResponse;
      for (const response of apiResponse) {
        expect(response.name.search("Dishonor")).toBeGreaterThan(-1);
      }
      done();
    });
  });

  it('should return expected results when using genre search', (done: DoneFn) => {
    service.search(10, "", [5, 12]).subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.status).toBe(200);
      const apiResponse = response.apiResponse;
      for (const response of apiResponse) {
        expect(response.genres.includes(5) || response.genres.includes(12)).toBeTruthy();
      }
      done();
    });
  });

  it('should return expected cover results', (done: DoneFn) => {
    service.getCoverURL(533, "1080p").subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.status).toBe(200);
      const apiResponse = response.apiResponse[0];
      expect(apiResponse.game).toEqual(533);
      expect(apiResponse.image_id).toEqual("co5pcs");
      expect(response.fullURL).toEqual("https://images.igdb.com/igdb/image/upload/t_1080p/co5pcs.png")
      done();
    });
  });

  it('should return expected covers list results', (done: DoneFn) => {
    service.getCoverList([533, 11118]).subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.status).toBe(200);
      const apiResponse = response.apiResponse;
      for (const response of apiResponse) {
        expect((response.game === 533) || (response.game === 11118)).toBeTruthy();
      }
      done();
    })
  });

  it('should return expected release year', () => {
    expect(service.getReleaseYear(1349740800)).toEqual(2012);
  });

  it('should return expected videogame profile from slug', (done: DoneFn) => {
    service.getVideogameProfileFromSlug("dishonored").subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.status).toBe(200);
      const apiResponse = response.apiResponse[0];
      expect(apiResponse.id).toEqual(533);
      expect(apiResponse.name).toEqual("Dishonored");
      done();
    });
  });

  it('should return expected videogame information list from idList', (done: DoneFn) => {
    service.getVideogameInfoForCorousel([533, 11118]).subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.status).toBe(200);
      const apiResponse = response.apiResponse;
      for (const videogame of apiResponse[0].result) {
        expect((videogame.id === 533) || (videogame.id === 11118)).toBeTruthy();
      }
      for (const cover of apiResponse[1].result) {
        expect((cover.game === 533) || (cover.game === 11118)).toBeTruthy();
      }
      done();
    });
  });

  it('should return expected platform names list from idList', (done: DoneFn) => {
    service.getPlatformNames([48, 6, 167]).subscribe((response) => {
      const expectedPlatformNames = ["PlayStation 5", "PlayStation 4", "PC (Microsoft Windows)"];
      expect(response).toBeTruthy();
      expect(response.status).toBe(200);
      const apiResponse = response.apiResponse;
      for (const platform of apiResponse) {
        expect(expectedPlatformNames.includes(platform.name)).toBe(true);
      }
      done();
    });
  });

  it('should return expected genre names list from idList', (done: DoneFn) => {
    service.getGenreNames([12, 25, 31]).subscribe((response) => {
      const expectedGenreNames = ["Role-playing (RPG)", "Hack and slash/Beat 'em up", "Adventure"];
      expect(response).toBeTruthy();
      expect(response.status).toBe(200);
      const apiResponse = response.apiResponse;
      for (const genre of apiResponse) {
        expect(expectedGenreNames.includes(genre.name)).toBe(true);
      }
      done();
    });
  });
});
