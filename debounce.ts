import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  Renderer2
} from "@angular/core";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";
import { fromEvent } from "rxjs";
import { Keyboard } from "@ionic-native/keyboard/ngx";

@Directive({
  selector: "[inputDebounce]"
})
export class inputDebounceDirective {
  @Output() value = new EventEmitter<any>();

  constructor(
    private el: ElementRef,
    private keyboard: Keyboard,
    private _renderer: Renderer2
  ) {
    fromEvent(this.el.nativeElement, "input")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        filter(res => res.length > -1),
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        this.value.emit(text);
      });
    fromEvent(this.el.nativeElement, "keypress").subscribe(event => {
      if (event["keyCode"] === 13) {
        this.keyboard.hide();
      }
    });
    fromEvent(this.el.nativeElement, "blur").subscribe(event => {
      this.keyboard.hide();
    });
  }

  ngOnInit() {
    this._renderer.setAttribute(
      this.el.nativeElement,
      "autocapitalize",
      "sentences"
    );
  }
}
