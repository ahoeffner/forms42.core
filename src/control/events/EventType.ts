export enum EventType
{
	Key,
	Mouse,

	Connect,
	Disconnect,

	FormInit,
	FormClose,

	PreForm,
	PostForm,

	PreBlock,
	PostBlock,

    PreField,
    PostField,

	Editing,
	WhenValidateField,

    PreRecord,
    PostRecord,

	PreQuery,
    PostQuery,

    PreInsert,
    PostInsert,

    PreUpdate,
    PostUpdate,

    PreDelete,
    PostDelete,

    LockRecord,
	WhenValidateRecord
}
