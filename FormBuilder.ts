import Controller from "./API/Controller";
import { LogEvent } from "./Utilities/Logger";
import "reflect-metadata";


class FormElement {
  constructor(
    public name: string,
    public type: string,
    public label: string = name
  ) {}

  render(): string {
    return `
            <label for="${this.name}">${this.label}</label>
            <input type="${this.type}" id="${this.name}" name="${this.name}">
        `;
  }
}
export class Form {
constructor(
    public elements: FormElement[] = [],
    public action: string = "",
    public method: string = "",
    public type: string = ""
) {}

  render(): string {
    let formHtml = `
            <h2>${this.method} - ${this.action} - ${this.type}</h2>
            <form action="${this.action}">
        `;

    for (const element of this.elements) {
      formHtml += element.render();
    }

    formHtml += '<input type="submit" value="Submit">';
    formHtml += "</form>";

    return formHtml;
  }
}


export class FormWithControllerContext<T extends { [key: string]: any }> extends Form {
    constructor(
        public elements: FormElement[] = [],
        public controller: Controller<T>,
        public action: string = "",
        public method: string = "",
        public type: string = ""
    ) {
        super(elements, action, method, type);
    }


  render(): string {
    // get controller path
    // const path = this.controller.router.stack.find(
    //     (r) => r.route.path === this.action
    //     )?.route.path;
    // 
    /**
let rootPath = getControllerRootPath(this.controller, routeControllerMap);
let formHtml = `
  <h2>${this.method} - ${rootPath}${this.action} - ${this.type}</h2>
  <form action="${rootPath}${this.action}">
`; */
    // const path = this.controller.getCustomRouteAction(this.action);
    let formHtml = `
            <h2>${this.method} - ${this.action} - ${this.type}</h2>
            <form action="${this.action}" method="${this.method}">
        `;

    for (const element of this.elements) {
      formHtml += element.render();
    }

    formHtml += '<input type="submit" value="Submit">';
    formHtml += "</form>";

    return formHtml;
  }
}

export class FormBuilder {
  createForm(repository: any): Form {
    const elements = Reflect.ownKeys(repository).map((key) => {
      const metadata = Reflect.getMetadata("design:type", repository, key);
      const type = metadata ? metadata.name : typeof repository[key];
      LogEvent.fromString(`Key: ${JSON.stringify(key)}`);
      switch (typeof repository[key]) {
        case "string":
          return new TextInputFormElement(key.toString());
        case "number":
          return new NumberInputFormElement(key.toString());
        case "boolean":
          return new CheckboxFormElement(key.toString());
        case "object":
          if (repository[key] instanceof Date) {
            return new DateInputFormElement(key.toString());
          } else if (repository[key] instanceof Array) {
            return new SelectFormElement(key.toString(), repository[key]);
          } else if (repository[key] instanceof File) {
            return new FileInputFormElement(key.toString());
          } else {
            return new TextAreaFormElement(key.toString());
          }
        case "undefined":
          return new TextInputFormElement(key.toString());
        default:
          return new TextInputFormElement(key.toString());
      }
    });
    return new Form(elements);
  }
}

class TextInputFormElement extends FormElement {
  constructor(name: string, label: string = name) {
    super(name, "text", label);
  }
  render(): string {
    return `
            <label for="${this.name}">${this.label}</label>
            <input type="${this.type}" id="${this.name}" name="${this.name}">
        `;
  }
}
class NumberInputFormElement extends FormElement {
  constructor(name: string, label: string = name) {
    super(name, "number", label);
  }
  render(): string {
    return `
            <label for="${this.name}">${this.label}</label>
            <input type="${this.type}" id="${this.name}" name="${this.name}">
        `;
  }
}
class DateInputFormElement extends FormElement {
  constructor(name: string, label: string = name) {
    super(name, "date", label);
  }
  render(): string {
    return `
                <label for="${this.name}">${this.label}</label>
                <input type="${this.type}" id="${this.name}" name="${this.name}">
            `;
  }
}
class EmailInputFormElement extends FormElement {
  constructor(name: string, label: string = name) {
    super(name, "email", label);
  }
  render(): string {
    return `
            <label for="${this.name}">${this.label}</label>
            <input type="${this.type}" id="${this.name}" name="${this.name}">
        `;
  }
}
class PasswordInputFormElement extends FormElement {
  constructor(name: string, label: string = name) {
    super(name, "password", label);
  }
  render(): string {
    return `
            <label for="${this.name}">${this.label}</label>
            <input type="${this.type}" id="${this.name}" name="${this.name}">
        `;
  }
}
class CheckboxFormElement extends FormElement {
  constructor(name: string, label: string = name) {
    super(name, "checkbox", label);
  }
  render(): string {
    return `
                <input type="${this.type}" id="${this.name}" name="${this.name}">
                <label for="${this.name}">${this.label}</label>
            `;
  }
}
class RadioFormElement extends FormElement {
  value: string;

  constructor(name: string, value: string, label: string = name) {
    super(name, "radio", label);
    this.value = value;
  }

  render(): string {
    return `
            <input type="${this.type}" id="${this.name}" name="${this.name}" value="${this.value}">
            <label for="${this.name}">${this.label}</label>
        `;
  }
}
class SelectFormElement extends FormElement {
  constructor(name: string, public options: string[], label: string = name) {
    super(name, "select", label);
  }

  render(): string {
    let optionsHtml = this.options
      .map((option) => `<option value="${option}">${option}</option>`)
      .join("");
    return `
            <label for="${this.name}">${this.label}</label>
            <select id="${this.name}" name="${this.name}">
                ${optionsHtml}
            </select>
        `;
  }
}
class TextAreaFormElement extends FormElement {
  constructor(name: string, label: string = name) {
    super(name, "textarea", label);
  }

  render(): string {
    return `
            <label for="${this.name}">${this.label}</label>
            <textarea id="${this.name}" name="${this.name}"></textarea>
        `;
  }
}
class FileInputFormElement extends FormElement {
  constructor(name: string, label: string = name) {
    super(name, "file", label);
  }
  render(): string {
    return `
            <label for="${this.name}">${this.label}</label>
            <input type="${this.type}" id="${this.name}" name="${this.name}">
        `;
  }
}

export class GenericControllerFormElementCollections {
  public static SingleTextForm(formName: string): FormElement[] {
    return [new TextInputFormElement(formName)];
  }

  public static TextAreasForm(formName: string): FormElement[] {
    return [new TextAreaFormElement(formName)];
  }

  public static TypedForm<T extends object>(
    _formName: string,
    type: T
  ): FormElement[] {
    const elements = Reflect.ownKeys(type).map((key: string | symbol) => {
      const metadata: any = Reflect.getMetadata("design:type", type, key);
      const keyType = metadata
        ? metadata.name
        : typeof (type[key as keyof T] as Record<string, unknown>);
      console.log(`Key: ${JSON.stringify(key)}`);
      switch (typeof type[key as keyof T]) {
        case "string":
          return new TextInputFormElement(key.toString());
        case "number":
          return new NumberInputFormElement(key.toString());
        case "boolean":
          return new CheckboxFormElement(key.toString());
        case "object":
          if (type[key as keyof T] instanceof Date) {
            return new DateInputFormElement(key.toString());
          } else if (Array.isArray(type[key as keyof T])) {
            return new SelectFormElement(
              key.toString(),
              type[key as keyof T] as unknown as string[]
            );
          } else if (type[key as keyof T] instanceof File) {
            return new FileInputFormElement(key.toString());
          } else {
            return new TextAreaFormElement(key.toString());
          }
        case "undefined":
          return new TextInputFormElement(key.toString());
        default:
          return new TextInputFormElement(key.toString());
      }
    });
    return elements;
  }

  public static SubmitOnly(): FormElement[] {
    return [new FormElement("submit", "submit")];
  }
}

export class ControllerMethodForms {
  static CreateForm<T extends object>(
    type: T,
    controller: Controller<T>
  ): Form {
    const elements = Reflect.ownKeys(type).map((key: string | symbol) => {
      const metadata: any = Reflect.getMetadata("design:type", type, key);
      const keyType = metadata
        ? metadata.name
        : typeof (type[key as keyof T] as Record<string, unknown>);
      console.log(`Key: ${JSON.stringify(key)}`);
      switch (typeof type[key as keyof T]) {
        case "string":
          return new TextInputFormElement(key.toString());
        case "number":
          return new NumberInputFormElement(key.toString());
        case "boolean":
          return new CheckboxFormElement(key.toString());
        case "object":
          if (type[key as keyof T] instanceof Date) {
            return new DateInputFormElement(key.toString());
          } else if (Array.isArray(type[key as keyof T])) {
            return new SelectFormElement(
              key.toString(),
              type[key as keyof T] as unknown as string[]
            );
          } else if (type[key as keyof T] instanceof File) {
            return new FileInputFormElement(key.toString());
          } else {
            return new TextAreaFormElement(key.toString());
          }
        case "undefined":
          return new TextInputFormElement(key.toString());
        default:
          return new TextInputFormElement(key.toString());
      }
    });
    return new FormWithControllerContext(
      elements,
      controller,
      "Create",
      "POST",
      "Create"
    );
  }

  public static UpdateForm<T extends object>(
    type: T,
    controller: Controller<T>
  ): Form {
    const elements = Reflect.ownKeys(type).map((key: string | symbol) => {
      const metadata: any = Reflect.getMetadata("design:type", type, key);
      const keyType = metadata
        ? metadata.name
        : typeof (type[key as keyof T] as Record<string, unknown>);
      console.log(`Key: ${JSON.stringify(key)}`);
      switch (typeof type[key as keyof T]) {
        case "string":
          return new TextInputFormElement(key.toString());
        case "number":
          return new NumberInputFormElement(key.toString());
        case "boolean":
          return new CheckboxFormElement(key.toString());
        case "object":
          if (type[key as keyof T] instanceof Date) {
            return new DateInputFormElement(key.toString());
          } else if (Array.isArray(type[key as keyof T])) {
            return new SelectFormElement(
              key.toString(),
              type[key as keyof T] as unknown as string[]
            );
          } else if (type[key as keyof T] instanceof File) {
            return new FileInputFormElement(key.toString());
          } else {
            return new TextAreaFormElement(key.toString());
          }
        case "undefined":
          return new TextInputFormElement(key.toString());
        default:
          return new TextInputFormElement(key.toString());
      }
    });
    return new FormWithControllerContext(
      elements,
      controller,
      "Update",
      "PUT",
      "Update"
    );
  }

  // this one is just a numeric id and submit
  public static DeleteForm<T extends object>(
    type: T,
    controller: Controller<T>
  ): Form {
    return new FormWithControllerContext(
      [new NumberInputFormElement("id")],
      controller,
      "Delete",
      "DELETE",
      "Delete"
    );
  }

  // this one is just a numeric id and submit
  public static FindForm<T extends object>(
    type: T,
    controller: Controller<T>
  ): Form {
    return new FormWithControllerContext(
      [new NumberInputFormElement("id")],
      controller,
      "Find",
      "GET",
      "Find"
    );
  }

  // this one is just a submit
public static AllForm<T extends object>(type: T, controller: Controller<T>): Form {
    return new FormWithControllerContext([], controller, "All", "GET", "All");
}
    
    


  // this one is just a texta
  public static QueryForm<T extends object>(
    type: T,
    controller: Controller<T>
  ): Form {
    return new FormWithControllerContext(
      [new TextAreaFormElement("query")],
      controller,
      "Query",
      "GET",
      "Query"
    );
  }
  // Future:
  // this one is just a textarea that provides the user with the context of the type
  // in "moustache" format eg. {{id}} {{name}} in the query. This gets translated to the
  // actual values when the query is run
  public static TypedQueryForm<T extends object>(
    type: T,
    controller: Controller<T>
  ): Form {
    return new FormWithControllerContext(
      [new TextAreaFormElement("query")],
      controller,
      "TypedQuery",
      "GET",
      "TypedQuery"
    );
  }

public static CustomRoute<T extends object>(
    path: string,
    type: T,
    form: Form,
    controller: Controller<T>
): Form {
    // clone form
    let clonedForm = JSON.parse(JSON.stringify(form));
    // attach the action
    // let action = controller.getCustomRouteAction(path);
    // clonedForm.action = action ? action : '';
    // return the form
    const formWithAction = new FormWithControllerContext(
        clonedForm.elements,
        controller,
        path,
       "",
        "CustomRoute"
    );
    return formWithAction;
}
}
