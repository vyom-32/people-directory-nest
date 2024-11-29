import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreatePersonDto } from './dtos/createPerson.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/create-person')
  createPerson(@Body() params: CreatePersonDto) {
    console.log('create-person', params);
    return this.appService.createPerson(params);
  }
  @Post('/person-count')
  personCount(@Body() params: { q: string }) {
    return this.appService.getPersonCount(params);
  }

  @Post('/person-list')
  getPersonList(@Body() params: { skip: number; limit: number }) {
    return this.appService.getPersonList(params);
  }

  @Post('/deleted-count')
  deletedPersonCount(@Body() params: { q: string }) {
    return this.appService.deletedPersonCount(params);
  }

  @Post('/deleted-list')
  deletedPersonList(@Body() params: { skip: number; limit: number }) {
    return this.appService.deletedPersonList(params);
  }

  @Post('/search-person-list')
  searchPersonList(@Body() params: { q: string }) {
    return this.appService.searchPersonList(params);
  }

  @Post('/delete-person')
  deletePerson(@Body() params: { ids: number[] }) {
    return this.appService.deletePerson(params);
  }

  @Post('/restore-person')
  restorePerson(@Body() params: { ids: number[] }) {
    return this.appService.restorePerson(params);
  }
}
