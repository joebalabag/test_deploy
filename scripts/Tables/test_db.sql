use test_db;
create table  superuser_admin (
superuser_id int not null AUTO_INCREMENT,
user_login nvarchar(100) not null,
user_passphrase nvarchar(4000) not null,
user_keycode nvarchar(4000) not null,
user_status nvarchar(100) default 'ACTIVE',
name nvarchar(500) null,
email_address nvarchar(500) null,
mobile_no nvarchar(500) null,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
statuschange_datetime datetime null,
statuschange_by nvarchar(500) null,
lastlogin_datetime datetime null,
primary key (superuser_id)  
);  
  
create table  m_subscription_type (
subscription_type_id int not null AUTO_INCREMENT,
description nvarchar(500) null,
month_length int default 0,
subscription_price decimal(32,2) default 0,
grace_period_day int default 0,
status nvarchar(500) null,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (subscription_type_id)  
);  
  
create table  m_company (
company_id int not null AUTO_INCREMENT,
name nvarchar(1000) null,
description nvarchar(4000) null,
address_street nvarchar(1000) null,
address_city nvarchar(1000) null,
address_province nvarchar(1000) null,
address_zip_code nvarchar(1000) null,
address_country nvarchar(1000) null,
address_complete nvarchar(4000) null,
mobile_no nvarchar(100) null,
telephone_no nvarchar(100) null,
corporation_status nvarchar(100) null,
contact_person nvarchar(500) null,
contact_mobile_no nvarchar(100) null,
contact_email_address nvarchar(100) null,
subscription_type_id int not null,
subscription_start_datetime datetime null,
subscription_grace_period_datetime datetime null,
subscription_expiration_datetime datetime null,
subscription_status nvarchar(100) null,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
corporation_statuschange_datetime datetime null,
corporation_statuschange_by nvarchar(500) null,
theme_color nvarchar(500) null,
billing_details nvarchar(4000) null,
primary key (company_id),  
FOREIGN KEY (subscription_type_id) REFERENCES m_subscription_type(subscription_type_id)  
);  
  
create table  m_company_usertype (
company_usertype_id int not null AUTO_INCREMENT,
company_id int not null,
description nvarchar(500) null,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
voided_datetime datetime null,
voided_by nvarchar(500) null,
primary key (company_usertype_id),  
foreign key (company_id) references m_company (company_id )  
);  
  
create table  m_company_contact (
company_contact_id int not null AUTO_INCREMENT,
company_id int not null,
id_number nvarchar(100) null,
main_contact_type nvarchar(255) null,
complete_name nvarchar(1000) null,
other_name nvarchar(1000) null,
first_name nvarchar(500) null,
middle_name nvarchar(500) null,
last_name nvarchar(500) null,
suffix nvarchar(100) null,
gender nvarchar(100) null,
birthdate date null,
mobile_no nvarchar(500) null,
email_address nvarchar(500) null,
address_street nvarchar(500) null,
address_city nvarchar(500) null,
address_province nvarchar(500) null,
address_zip_code nvarchar(500) null,
address_country nvarchar(500) null,
address_complete nvarchar(1000) null,
contact_name nvarchar(500) null,
contact_address nvarchar(500) null,
contact_mobile_no nvarchar(500) null,
contact_telephone_no nvarchar(500) null,
contact_email_address nvarchar(500) null,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (company_contact_id),  
foreign key (company_id) references m_company (company_id)  
);  
  
create table  m_company_user (
company_user_id int not null AUTO_INCREMENT,
company_id int not null,
company_contact_id int not null,
company_usertype_id int not null,
user_login nvarchar(500) not null,
user_passphrase nvarchar(4000) not null,
user_keycode nvarchar(4000) not null,
user_status nvarchar(100) default 'ACTIVE',
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
user_statuschange_datetime datetime null,
user_statuschange_by nvarchar(500) null,
primary key (company_user_id),  
foreign key (company_id) references m_company (company_id),  
foreign key (company_contact_id) references m_company_contact (company_contact_id),  
foreign key (company_usertype_id) references m_company_usertype(company_usertype_id) 
);  
  
create table  m_department  (
department_id int not null AUTO_INCREMENT,
company_id int not null,
abbreviation nvarchar(100) null,
description nvarchar(500) null,
is_warehouse bool default 0,
is_pos bool default 0,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
voided_datetime datetime null,
voided_by nvarchar(500) null,
primary key (department_id),  
foreign key (company_id) references m_company (company_id)
);  
  
create table  m_item_group (
item_group_id int not null AUTO_INCREMENT,
company_id int not null,
description nvarchar(500) null,
is_active bool default 1,
is_inventory bool default 0,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
voided_datetime datetime null,
voided_by nvarchar(500) null,
primary key (item_group_id),  
foreign key (company_id) references m_company (company_id)  
);  
  
create table m_item_category (
item_category_id int not null AUTO_INCREMENT,
item_group_id int not null,
description nvarchar(500) null,
item_code_prefix nvarchar(100) null,
item_code_series nvarchar(100) null,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
voided_datetime datetime null,
voided_by nvarchar(500) null,
primary key (item_category_id),  
foreign key (item_group_id) references m_item_group (item_group_id) 
);  
  
create table  m_item_generic (
item_generic_id int not null AUTO_INCREMENT,
company_id int not null,
description nvarchar(500) null,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
voided_datetime datetime null,
voided_by nvarchar(500) null,
primary key (item_generic_id),  
foreign key (company_id) references m_company (company_id)  
);  
  
create table m_item (
item_id int not null AUTO_INCREMENT,
company_id int not null,
item_category_id int not null,
item_generic_id int not null,
item_code nvarchar(500) null,
item_barcode nvarchar(500) null,
description nvarchar(4000) null,
additional_description nvarchar(4000) null,
item_unit nvarchar(100) null,
last_purchase_price decimal(32,2) default 0,
last_purchase_datetime datetime null,
selling_based_price decimal(32,2) default 0,
selling_markup_pct decimal(32,2) default 0,
purchase_status nvarchar(100) default 'AVAILABLE',
is_discountable bool default 0,
is_vatable bool default 0,
is_vatexempt bool default 0,
is_repacking bool default 0,
is_expiry bool default 0,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
voided_datetime datetime null,
voided_by nvarchar(500) null,
primary key (item_id),  
foreign key (item_category_id) references m_item_category (item_category_id),  
foreign key (item_generic_id) references m_item_generic (item_generic_id),  
foreign key (company_id) references m_company (company_id)  
);  
  
create table  mms_purchase_request (
purchase_request_id int not null AUTO_INCREMENT,
company_id int not null,
purchase_request_no nvarchar(500) null,
purchase_request_dept_id int not null,
purchase_order_dept_id int not null,
description nvarchar(4000) null,
remarks nvarchar(4000) null,
is_active bool default 1,
is_emergency_purchase bool default 0,
posted_datetime datetime null,
posted_by nvarchar(500) null,
approved_datetime datetime null,
approved_by nvarchar(500) null,
purchase_request_status nvarchar(500) null,
purchase_request_status_datetime datetime null,
purchase_request_status_remarks nvarchar(4000) null,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (purchase_request_id),  
foreign key (purchase_request_dept_id) references m_department (dept_id),  
foreign key (purchase_order_dept_id) references m_department (dept_id),  
foreign key (company_id) references m_company (company_id)  
);  
  
create table  mms_purchase_request_line (
purchase_request_line_id int not null AUTO_INCREMENT,
purchase_request_id int not null,
item_id int not null,
item_remarks nvarchar(4000) null,
item_unit nvarchar(100) null,
requested_qty decimal(32,2) default 0,
unit_cost decimal(32,2) default 0,
purchase_request_line_status nvarchar(500) null,
purchase_request_line_status_datetime datetime default now(),
purchase_request_line_status_remarks nvarchar(4000) null,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (purchase_request_line_id),  
foreign key (purchase_request_id) references mms_purchase_request (purchase_request_id),  
foreign key (item_id) references m_item (item_id)  
);  
  
create table mms_purchase_order (
purchase_order_id int not null AUTO_INCREMENT,
company_id int not null,
purchase_request_id int not null,
purchase_order_no nvarchar(500) null,
purchase_order_dept_id int not null,
purchase_request_dept_id int not null,
delivery_dept_id int not null,
company_contact_id int not null,
expected_delivery_date date null,
payment_terms nvarchar(500) null,
description nvarchar(4000) null,
remarks nvarchar(4000) null,
TotalCost decimal(32,2) default 0,
is_active bool default 1,
is_emergency_purchase bool default 0,
posted_datetime datetime null,
posted_by nvarchar(500) null,
approved_datetime datetime null,
approved_by nvarchar(500) null,
purchase_order_status nvarchar(500) null,
purchase_order_status_datetime datetime null,
purchase_order_status_remarks nvarchar(4000) null,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (purchase_order_id),  
foreign key (company_id) references m_company (company_id),  
foreign key (purchase_request_id) references mms_purchase_request (purchase_request_id),  
foreign key (purchase_order_dept_id) references m_department (dept_id),  
foreign key (purchase_request_dept_id) references m_department (dept_id),  
foreign key (delivery_dept_id) references m_department (dept_id),  
foreign key (company_contact_id) references m_company_contact (company_contact_id)
);  
  
create table  mms_purchase_order_line (
purchase_order_line_id int not null AUTO_INCREMENT,
purchase_order_id int not null,
purchase_request_line_id int not null,
item_id int not null,
item_remarks nvarchar(4000) null,
item_unit nvarchar(100) null,
order_qty decimal(32,2) default 0,
unit_cost nvarchar(500) default 'PENDING',
purchase_order_line_status nvarchar(500) null,
purchase_order_line_status_datetime datetime default now(),
purchase_order_line_status_remarks nvarchar(4000) null,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (purchase_order_line_id),  
foreign key (purchase_order_id) references mms_purchase_order (purchase_order_id),  
foreign key (item_id) references m_item (item_id) 
);  
  
create table  mms_delivery (
delivery_id int not null AUTO_INCREMENT,
company_id int not null,
purchase_order_id int not null,
delivery_dept_id int not null,
company_contact_id int not null,
delivery_no nvarchar(500) null,
delivery_datetime date null,
invoice_no nvarchar(500) null,
invoice_cost decimal(32,2) default 0,
remarks nvarchar(4000) null,
deliver_by nvarchar(500) null,
deliver_by_contactno nvarchar(500) null,
wtx_amount decimal(32,2) default 0,
vat_amount decimal(32,2) default 0,
is_vatable bool default 0,
is_wtx bool default 0,
wtx_pct decimal(32,2) default 0,
is_active bool default 1,
is_direct_delivery bool default 0,
delivery_status nvarchar(500) null,
delivery_status_datetime datetime default now(),
delivery_status_remarks nvarchar(4000) null,
journal_id int default 0,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (delivery_id),  
foreign key (company_id) references m_company (company_id),  
foreign key (purchase_order_id) references mms_purchase_order (purchase_order_id),  
foreign key (delivery_dept_id) references m_department (dept_id),  
foreign key (company_contact_id) references m_company_contact (company_contact_id)
);  
  
create table  mms_delivery_line (
delivery_line_id int not null AUTO_INCREMENT,
delivery_id int not null,
purchase_order_line_id int not null,
item_id int not null,
lot_no nvarchar(500) null,
expiry_date date null,
item_unit nvarchar(100) null,
delivery_qty decimal(32,2) default 0,
unit_cost decimal(32,2) default 0,
unit_wtx_amount decimal(32,2) default 0,
unit_vat_amount decimal(32,2) default 0,
wtx_pct decimal(32,2) default 0,
is_vatable bool default 0,
is_free bool default 0,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (delivery_line_id),  
foreign key (delivery_id) references mms_delivery (delivery_id),  
foreign key (purchase_order_line_id) references mms_purchase_order_line (purchase_order_line_id),  
foreign key (item_id) references m_item (item_id)  
);  


create table  mms_stock_request (
stock_request_id int not null AUTO_INCREMENT,
company_id int not null,
stock_request_no nvarchar(500) null,
stock_request_dept_id int not null,
stock_order_dept_id int not null,
description nvarchar(4000) null,
remarks nvarchar(4000) null,
is_active bool default 1,
posted_datetime datetime null,
posted_by nvarchar(500) null,
approved_datetime datetime null,
approved_by nvarchar(500) null,
stock_request_status nvarchar(500) null,
stock_request_status_datetime datetime null,
stock_request_status_remarks nvarchar(4000) null,
stock_request_status_by nvarchar(500) null,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (stock_request_id),  
foreign key (company_id) references m_company (company_id),  
foreign key (stock_order_dept_id) references m_department (dept_id),  
foreign key (stock_request_dept_id) references m_department (dept_id)  
);  

create table  mms_stock_request_line (
stock_request_line_id int not null AUTO_INCREMENT,
stock_request_id int not null,
item_id int not null,
item_remarks nvarchar(4000) null,
item_unit nvarchar(100) null,
requested_qty decimal(32,2) default 0,
stock_request_line_status nvarchar(500) null,
stock_request_line_status_datetime datetime null,
stock_request_line_status_remarks nvarchar(4000) null,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (stock_request_line_id),  
foreign key (stock_request_id) references mms_stock_request (stock_request_id),  
foreign key (item_id) references m_item (item_id)  
);  


/* AMS RELATED TABLE */
use test_db;

create table  m_account_type (
account_type_id int not null AUTO_INCREMENT,
company_id int not null,
account_type_code nvarchar(100) null,
description nvarchar(1000) null,
fs_type nvarchar(500) null,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (account_type_id),  
foreign key (company_id) references m_company (company_id )  
);  
  
create table  m_account_group (
account_group_id int not null AUTO_INCREMENT,
account_type_id int not null,
account_group_code nvarchar(100) null,
description nvarchar(1000) null,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (account_group_id),  
foreign key (account_type_id) references m_account_type (account_type_id)  
);  
  
create table m_account_subgroup (
account_subgroup_id int not null AUTO_INCREMENT,
account_group_id int not null,
account_subgroup_code nvarchar(100) null,
description nvarchar(1000) null,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (account_subgroup_id),  
foreign key (account_group_id) references m_account_group (account_group_id)  
);  
  
create table  m_account (
account_id int not null AUTO_INCREMENT,
account_subgroup_id int not null,
account_code nvarchar(100) null,
description nvarchar(1000) null,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (account_id),  
foreign key (account_subgroup_id) references m_account_subgroup (account_subgroup_id)  
);  

create table  m_bank_account (
bank_account_id int not null AUTO_INCREMENT,
account_id int not null,
title nvarchar(1000) null,
account_number nvarchar(1000) null,
bank_name nvarchar(1000) null,
branch nvarchar(1000) null,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (bank_account_id),  
foreign key (account_id) references m_account (account_id)  
);  
  
create table ams_journal (
journal_id int not null AUTO_INCREMENT,
company_id int not null,
company_contact_id int not null,
reference_number nvarchar(500) null,
journal_memo nvarchar(4000) null,
remarks nvarchar(4000) null,
amount decimal(32,2) default 0,
journal_status nvarchar(500) default 'PENDING',
journal_datetime datetime null,
journal_by nvarchar(500) null,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
journal_statuschange_datetime datetime null,
journal_statuschange_by nvarchar(500) null,
primary key (journal_id),  
foreign key (company_id) references m_company (company_id),  
foreign key (company_contact_id) references m_company_contact (company_contact_id)  
);  
  
create table  ams_journal_entries (
journal_entries_id int not null AUTO_INCREMENT,
journal_id int not null,
account_id int not null,
debit decimal(32,4) default 0,
credit decimal(32,4) default 0,
cost_dept_id int not null,
req_dept_id int not null,
cost_company_contact_id int not null,
from_company_contact_id int not null,
description nvarchar(4000) null,
additional_description nvarchar(4000) null,
transaction_no nvarchar(500) null,
transaction_id int default 0,
transaction_idcolumn nvarchar(500) null,
journal_datetime datetime null,
journal_by nvarchar(500) null,
journal_status nvarchar(500) default 'PENDING',
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (journal_entries_id),  
foreign key (journal_id) references ams_journal (journal_id), 
foreign key (account_id) references m_account (account_id) ,
foreign key (cost_dept_id) references m_department (dept_id),  
foreign key (req_dept_id) references m_department (dept_id),  
foreign key (cost_company_contact_id) references m_company_contact (company_contact_id),  
foreign key (from_company_contact_id) references m_company_contact (company_contact_id)
);  

create table  ams_journal_document (
journal_document_id int not null AUTO_INCREMENT,
journal_id int default 0,
reference_no nvarchar(255) null,
document_no nvarchar(255) null,
description nvarchar(1500) null,
document_filepath nvarchar(1500) null,
document_datetime datetime default null,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (journal_document_id)
)  ;


use test_db;

create table  pos_menu_category (
menu_category_id int not null AUTO_INCREMENT,
company_id int not null,
description nvarchar(500) null,
is_active bit default 1,
created_datetime datetime default NOW(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (menu_category_id),  
foreign key (company_id) references m_company (company_id )  
);  
  
  
create table  pos_menu_item (
menu_item_id int not null AUTO_INCREMENT,
menu_category_id int not null,
company_id int not null,
item_id int not null,
is_active bit default 1,
created_datetime datetime default NOW(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (menu_item_id),  
foreign key (company_id) references m_company (company_id ),  
foreign key (menu_category_id) references pos_menu_category (menu_category_id),  
foreign key (item_id) references m_item (item_id)  
);  

create table  pos_terminal (
terminal_id int not null AUTO_INCREMENT,
company_id int not null,
description nvarchar(500) null,
is_active bit default 1,
created_datetime datetime default NOW(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (terminal_id),  
foreign key (company_id) references m_company (company_id )  
);  


create table  pos_transaction (
transaction_id int not null AUTO_INCREMENT,
company_id int not null,
terminal_id int not null,
menu_type nvarchar(500) null,
table_no nvarchar(500) null,
transaction_no nvarchar(500) null,
company_contact_id int default 0,
customer_name nvarchar(500) null,
customer_address nvarchar(1000) null,
customer_idno nvarchar(500) null,
customer_idtype nvarchar(500) null,
discount_scheme_id int default 0,
discount_pct decimal(32,2) default 0,
discount_head_multiplier decimal(32,2) default 0,
amount_gross decimal(32,2) default 0,
amount_vat decimal(32,2) default 0,
amount_discount decimal(32,2) default 0,
amount_net decimal(32,2) default 0,
transaction_status nvarchar(500) default 'PENDING',
remarks nvarchar(4000) null,
is_active bit default 1,
created_datetime datetime default NOW(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
voided_by datetime null,
voided_datetime nvarchar(500) null,
primary key (transaction_id),  
foreign key (company_id) references m_company (company_id ),  
foreign key (terminal_id) references pos_terminal (terminal_id),  
foreign key (discount_scheme_id) references m_discount_scheme(discount_scheme_id)  
);  
  


create table  pos_transaction_line (
transaction_line_id int not null AUTO_INCREMENT,
transaction_id int not null,
item_id int not null,
qty decimal(32,2) default 0,
unit nvarchar(500) null,
amount_selling decimal(32,2) default 0,
amount_vatable decimal(32,2) default 0,
amount_discount decimal(32,2) default 0,
amount_net decimal(32,2) default 0,
category nvarchar(500) null,
stock_issuance_line_id int default 0,
cost decimal(32,2) default 0,
is_active bit default 1,
created_datetime datetime default NOW(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
voided_by datetime null,
voided_datetime nvarchar(500) null,
primary key (transaction_line_id),  
foreign key (transaction_id) references pos_transaction (transaction_id),  
foreign key (item_id) references m_item (item_id)  
);  


use test_db;

create table  mms_begbalance_stock (
beg_balance_stock_id int not null AUTO_INCREMENT,
company_id int not null,
beg_balance_dept_id int not null,
beg_balance_no nvarchar(500), 
company_contact_id int not null,
remarks nvarchar(4000) null,
is_active bit default 1,
beg_balance_status nvarchar(500) default 'PENDING',
beg_balance_status_datetime datetime default now(),
beg_balance_status_remarks nvarchar(4000) null,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
posted_datetime datetime null,
posted_by nvarchar(500) null,
primary key (beg_balance_stock_id),  
foreign key (company_id) references m_company (company_id),  
foreign key (beg_balance_dept_id) references m_department (dept_id),  
foreign key (company_contact_id) references m_company_contact(company_contact_id)  
);  


  
create table  mms_begbalance_stock_line (
beg_balance_stock_line_id int not null AUTO_INCREMENT,
beg_balance_stock_id int not null,
item_id int not null,
item_unit nvarchar(500) null,
begbalance_qty decimal(32,2) default 0,
unit_cost decimal(32,2) default 0,
unit_wtx_amount decimal(32,2) default 0,
unit_vat_amount decimal(32,2) default 0,
wtx_pct decimal(32,2) default 0,
is_vatable bool default 0,
is_free bool default 0,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (beg_balance_stock_line_id),  
foreign key (beg_balance_stock_id) references mms_begbalance_stock (beg_balance_stock_id),  
foreign key (item_id) references m_item (item_id)  
);  
  
  
  
create table  mms_begbalance_stock_status_logs (
beg_balance_stock_status_id int not null AUTO_INCREMENT,
beg_balance_stock_id int not null,
status_level int not null,
description nvarchar(500) null,
remarks nvarchar(4000) null,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (beg_balance_stock_status_id),  
foreign key (beg_balance_stock_id) references mms_begbalance_stock (beg_balance_stock_id)  
);  
  
  
  
create table  mms_stock_issuance (
stock_issuance_id int not null AUTO_INCREMENT,
company_id int not null,
stock_issuance_no nvarchar(500) null,
remarks nvarchar(4000) null,
issuer_dept_id int not null,
receiver_dept_id int not null,
stock_issuance_status nvarchar(500) default 'PENDING',
stock_issuance_status_datetime datetime default now(),
stock_issuance_status_remarks nvarchar(4000) null,
is_active bool default 1,
journal_id int default 0,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
received_by nvarchar(500) null,
received_datetime datetime null,
received_remarks nvarchar(4000) null,
has_accounting_journal bool default 0,
primary key (stock_issuance_id),  
foreign key (company_id) references m_company (company_id),  
foreign key (issuer_dept_id) references m_department (dept_id), 
foreign key (receiver_dept_id) references m_department (dept_id) 
);  


  
create table  mms_stock_issuance_line (
stock_issuance_line_id int not null AUTO_INCREMENT,
stock_issuance_id int not null,
company_contact_id int not null,
item_expiry_date datetime null,
trans_line_id int default 0,
trans_column nvarchar(500) null,
trans_type nvarchar(500) null,
item_id int not null,
item_unit nvarchar(500) null,
stock_qty decimal(32,2) default 0,
unit_cost decimal(32,2) default 0,
unit_wtx_amount decimal(32,2) default 0,
unit_vat_amount decimal(32,2) default 0,
wtx_pct decimal(32,2) default 0,
is_vatable bool default 0,
is_free bool default 0,
is_active bool default 1,
stock_issuance_line_id_main int default 0,
stock_category nvarchar(500) null,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (stock_issuance_line_id),  
foreign key (stock_issuance_id) references mms_stock_issuance (stock_issuance_id),  
foreign key (item_id) references m_item (item_id)  
);  
  
  
  
create table  mms_stock_issuance_status_logs (
stock_issuance_status_id int not null AUTO_INCREMENT,
stock_issuance_id int not null,
status_level int not null,
description nvarchar(500) null,
remarks nvarchar(4000) null,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (stock_issuance_status_id),  
foreign key (stock_issuance_id) references mms_stock_issuance (stock_issuance_id)  
);  
  
  
  
create table  mms_stock_adjustment (
stock_adjustment_id int not null AUTO_INCREMENT,
company_id int not null,
stock_issuance_line_id int not null,
item_id int not null,
adjustment_qty decimal(32,2),
adjustment_type nvarchar(500) default 'ADD',
adjustment_remarks nvarchar(4000) null,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
journal_id int default 0,
primary key (stock_adjustment_id),  
foreign key (company_id) references m_company (company_id), 
foreign key (stock_issuance_line_id) references mms_stock_issuance_line (stock_issuance_line_id),  
foreign key (item_id) references m_item (item_id)  
);  
  
  
create table  mms_stock_return_supplier (
stock_return_supplier_id int not null AUTO_INCREMENT,
company_id int not null,
company_contact_id int not null,
dept_id int not null,
return_supplier_no nvarchar(500) null,
return_type nvarchar(500) null,
remarks nvarchar(4000) null,
return_status nvarchar(500) default 'PENDING',
return_status_datetime datetime default Now(),
return_status_remarks nvarchar(4000) null,
is_active bool default 1,
journal_id int default 0,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
received_by nvarchar(500) null,
received_datetime datetime null,
received_remarks nvarchar(4000) null,
primary key (stock_return_supplier_id),  
foreign key (company_id) references m_company (company_id),  
foreign key (dept_id) references m_department (dept_id),  
foreign key (company_contact_id) references m_company_contact(company_contact_id)  
);  
  
  
  
create table  mms_stock_return_supplier_line (
stock_return_supplier_line_id int not null AUTO_INCREMENT,
stock_return_supplier_id int not null,
stock_issuance_line_id int not null,
item_id int not null,
return_qty decimal(32,2) default 0,
remarks nvarchar(4000) null,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (stock_return_supplier_line_id),  
foreign key (stock_return_supplier_id) references mms_stock_return_supplier (stock_return_supplier_id),  
foreign key (item_id) references m_item (item_id)  
);  
  
  
  
create table  mms_stock_return_supplier_status_logs (
stock_return_supplier_status_log_id int not null AUTO_INCREMENT,
stock_return_supplier_id int not null,
status_level int not null,
description nvarchar(500) null,
remarks nvarchar(4000) null,
is_active bool default 1,
created_datetime datetime default now(),
created_by nvarchar(500) null,
updated_datetime datetime null,
updated_by nvarchar(500) null,
primary key (stock_return_supplier_status_log_id),  
foreign key (stock_return_supplier_id) references mms_stock_return_supplier (stock_return_supplier_id)  
);  


/** put tank in a mall.dd**/

